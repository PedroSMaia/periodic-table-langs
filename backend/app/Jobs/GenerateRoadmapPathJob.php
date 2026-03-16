<?php

namespace App\Jobs;

use App\Models\RoadmapPath;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateRoadmapPathJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 1200;
    public int $tries   = 3;
    public int $backoff = 60;

    public function __construct(
        public readonly string $language,
        public readonly string $pathId,
        public readonly array  $pathStub,
    ) {
        $this->onQueue('roadmaps');
    }

    public function middleware(): array
    {
        return [
            (new WithoutOverlapping("{$this->language}::{$this->pathId}"))->releaseAfter(600),
        ];
    }

    public function handle(): void
    {
        Log::info('GenerateRoadmapPathJob started', ['language' => $this->language, 'path' => $this->pathId]);

        try {
            RoadmapPath::updateOrCreate(
                ['language' => $this->language, 'path_id' => $this->pathId],
                ['data' => ['status' => 'generating'], 'generated_at' => now()]
            );

            $data = $this->generatePath();

            RoadmapPath::updateOrCreate(
                ['language' => $this->language, 'path_id' => $this->pathId],
                ['data' => array_merge(['status' => 'ready'], $data), 'generated_at' => now()]
            );

            Log::info('GenerateRoadmapPathJob completed', ['language' => $this->language, 'path' => $this->pathId]);
        } catch (\Exception $e) {
            Log::error('GenerateRoadmapPathJob failed', ['language' => $this->language, 'path' => $this->pathId, 'error' => $e->getMessage()]);

            RoadmapPath::updateOrCreate(
                ['language' => $this->language, 'path_id' => $this->pathId],
                ['data' => ['status' => 'failed'], 'generated_at' => now()]
            );
        }
    }

    private function generatePath(): array
    {
        $label        = $this->pathStub['label'];
        $category     = $this->pathStub['category']      ?? '';
        $categoryIcon = $this->pathStub['category_icon'] ?? '';
        $icon         = $this->pathStub['icon']           ?? '📦';
        $pathId       = $this->pathStub['id'];

        // ── Call 1: phase list only ───────────────────────────────────────────
        $phasesPrompt = "List the learning phases for the \"{$label}\" path in {$this->language}.\n\nReturn ONLY a raw JSON array. No markdown. No backticks. No explanation.\n\n[\n  {\n    \"id\": \"{$pathId}-phase-1\",\n    \"label\": \"Phase Label\",\n    \"description\": \"One sentence describing what this phase covers.\"\n  }\n]\n\nRules:\n- 4 to 7 phases maximum\n- Cover: setup, core concepts, ecosystem, testing, deployment, advanced patterns\n- All ids must start with \"{$pathId}-\"";

        $phasesRaw = $this->claudeCall($phasesPrompt, 2000);
        $phases    = $this->parseJson($phasesRaw);
        if (! $phases || ! is_array($phases)) {
            throw new \Exception('Invalid JSON from Claude API (phases list)');
        }

        Log::info('GenerateRoadmapPathJob phases', ['language' => $this->language, 'path' => $this->pathId, 'count' => count($phases)]);

        // ── Call 2..N: topics per phase ───────────────────────────────────────
        $fullPhases = [];
        foreach ($phases as $phase) {
            $phaseId    = $phase['id'];
            $phaseLabel = $phase['label'];
            $phaseDesc  = $phase['description'];

            $topicsPrompt = "Generate the topics for the \"{$phaseLabel}\" phase of the \"{$label}\" path in {$this->language}.\n\nReturn ONLY a raw JSON array of topics. No markdown. No backticks. No explanation.\n\n[\n  {\n    \"id\": \"{$phaseId}-topic-1\",\n    \"label\": \"Topic Name\",\n    \"description\": \"2 sentences: what to learn and why it matters.\",\n    \"type\": \"required\",\n    \"resources\": [\"https://url1.com\", \"https://url2.com\"]\n  }\n]\n\nRules:\n- 5 to 10 topics maximum\n- types: required, optional, or advanced\n- resources: exactly 2 real working URLs per topic (official docs preferred)\n- All ids must start with \"{$phaseId}-\"";

            $topicsRaw = $this->claudeCall($topicsPrompt, 4000);
            $topics    = $this->parseJson($topicsRaw);
            if (! $topics || ! is_array($topics)) {
                Log::warning('GenerateRoadmapPathJob skipping phase (invalid JSON)', ['phase' => $phaseId]);
                $topics = [];
            }

            $fullPhases[] = [
                'id'          => $phaseId,
                'label'       => $phaseLabel,
                'description' => $phaseDesc,
                'topics'      => $topics,
            ];

            Log::info('Claude call (path phase)', ['phase' => $phaseLabel, 'topics' => count($topics)]);
        }

        return [
            'id'            => $pathId,
            'label'         => $label,
            'description'   => $this->pathStub['description'] ?? '',
            'icon'          => $icon,
            'category'      => $category,
            'category_icon' => $categoryIcon,
            'phases'        => $fullPhases,
        ];
    }

    private function claudeCall(string $prompt, int $maxTokens): string
    {
        $apiKey   = config('services.anthropic.key');
        $response = Http::withHeaders([
            'x-api-key'         => $apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type'      => 'application/json',
        ])->timeout(120)->post('https://api.anthropic.com/v1/messages', [
            'model'       => 'claude-sonnet-4-6',
            'max_tokens'  => $maxTokens,
            'temperature' => 0,
            'messages'    => [['role' => 'user', 'content' => $prompt]],
        ]);

        if ($response->failed()) throw new \Exception('Claude API failed: ' . $response->status());

        $json = $response->json();
        Log::info('Claude call', ['stop_reason' => $json['stop_reason'] ?? 'unknown', 'output_tokens' => $json['usage']['output_tokens'] ?? 0]);

        return $json['content'][0]['text'] ?? '';
    }

    private function parseJson(string $content): mixed
    {
        $content = trim($content);
        $decoded = json_decode($content, true);
        if (json_last_error() === JSON_ERROR_NONE) return $decoded;

        $clean   = preg_replace('/^```(?:json)?\s*/m', '', $content);
        $clean   = preg_replace('/\s*```\s*$/m', '', $clean);
        $decoded = json_decode(trim($clean), true);
        if (json_last_error() === JSON_ERROR_NONE) return $decoded;

        if (preg_match('/[\[\{][\s\S]*[\]\}]/m', $content, $matches)) {
            $decoded = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) return $decoded;
        }

        return null;
    }
}

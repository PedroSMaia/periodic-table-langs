<?php

namespace App\Jobs;

use App\Models\Roadmap;
use App\Models\RoadmapPath;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateRoadmapJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 1200; // 20 minutes max
    public int $tries   = 1;    // Don't retry — expensive API calls

    public function __construct(public readonly string $language) {}

    public function handle(): void
    {
        Log::info('GenerateRoadmapJob started', ['language' => $this->language]);

        try {
            // Mark as generating
            Roadmap::updateOrCreate(
                ['language' => $this->language],
                ['data' => ['status' => 'generating', 'core' => [], 'paths' => []], 'generated_at' => now()]
            );

            $data = $this->generateCore($this->language);

            Roadmap::updateOrCreate(
                ['language' => $this->language],
                ['data' => $data, 'generated_at' => now()]
            );

            // Create stubs for all paths not yet cached
            foreach ($data['paths'] as $path) {
                RoadmapPath::firstOrCreate(
                    ['language' => $this->language, 'path_id' => $path['id']],
                    ['data' => ['status' => 'not_cached', 'label' => $path['label'] ?? '', 'category' => $path['category'] ?? '', 'icon' => $path['icon'] ?? ''], 'generated_at' => now()]
                );
            }

            Log::info('GenerateRoadmapJob completed', [
                'language' => $this->language,
                'paths'    => count($data['paths']),
                'phases'   => count($data['core']),
            ]);
        } catch (\Exception $e) {
            Log::error('GenerateRoadmapJob failed', ['language' => $this->language, 'error' => $e->getMessage()]);

            // Mark as failed so frontend can show error
            Roadmap::updateOrCreate(
                ['language' => $this->language],
                ['data' => ['status' => 'failed', 'core' => [], 'paths' => []], 'generated_at' => now()]
            );
        }
    }

    // ── Generation logic ──────────────────────────────────────────────────────

    private function generateCore(string $language): array
    {
        // Call 1: core phases
        $coreResponse = $this->callClaude($this->buildCorePhasesPrompt($language), 16000);
        $coreDecoded  = $this->parseJson($coreResponse);
        if (! $coreDecoded) throw new \Exception('Invalid JSON (core phases)');

        // Call 2: categories specific to this language
        $categoriesResponse = $this->callClaude($this->buildCategoriesPrompt($language), 1000);
        $categoriesDecoded  = $this->parseJson($categoriesResponse);
        if (! $categoriesDecoded) throw new \Exception('Invalid JSON (categories)');

        $categories = $categoriesDecoded['categories'] ?? [];

        // Call 3..N: one call per category
        $allPaths = [];
        foreach ($categories as $cat) {
            $pathsResponse = $this->callClaude($this->buildCategoryPathsPrompt($language, $cat['name'], $cat['icon']), 4000);
            $pathsDecoded  = $this->parseJson($pathsResponse);

            if ($pathsDecoded && isset($pathsDecoded['paths'])) {
                $allPaths = array_merge($allPaths, $pathsDecoded['paths']);
            } else {
                Log::warning('Category paths failed', ['language' => $language, 'category' => $cat['name']]);
            }
        }

        return [
            'status' => 'ready',
            'core'   => $coreDecoded['core'] ?? [],
            'paths'  => $allPaths,
        ];
    }

    private function callClaude(string $prompt, int $maxTokens = 4000): string
    {
        $apiKey = config('services.anthropic.key');

        $timeout = match(true) {
            $maxTokens >= 16000 => 300,
            $maxTokens >= 4000  => 120,
            default             => 60,
        };

        $response = Http::withHeaders([
            'x-api-key'         => $apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type'      => 'application/json',
        ])->timeout($timeout)->post('https://api.anthropic.com/v1/messages', [
            'model'       => 'claude-sonnet-4-6',
            'max_tokens'  => $maxTokens,
            'temperature' => 0,
            'messages'    => [['role' => 'user', 'content' => $prompt]],
        ]);

        if ($response->failed()) {
            throw new \Exception('Claude API failed: ' . $response->status());
        }

        $json = $response->json();
        Log::info('Claude call', [
            'stop_reason'   => $json['stop_reason'] ?? 'unknown',
            'output_tokens' => $json['usage']['output_tokens'] ?? 0,
        ]);

        if (($json['stop_reason'] ?? '') === 'max_tokens') {
            Log::warning('Claude truncated', ['max_tokens' => $maxTokens]);
        }

        return $json['content'][0]['text'] ?? '';
    }

    private function buildCorePhasesPrompt(string $language): string
    {
        return <<<PROMPT
Generate the complete core learning phases for {$language}.

Return ONLY a raw JSON object. No markdown. No backticks. No explanation.

Structure:
{
  "core": [
    {
      "id": "core-1",
      "label": "Phase Label",
      "description": "What this phase covers",
      "topics": [
        {
          "id": "core-1-1",
          "label": "Topic Name",
          "description": "1-2 sentences on what to learn and why.",
          "type": "required",
          "resources": ["https://url1.com", "https://url2.com"]
        }
      ]
    }
  ]
}

Rules:
- 5-7 phases, 8-12 topics each — cover everything a {$language} developer needs before specializing
- Don't skip anything: syntax, types, OOP, error handling, standard library, tooling, testing basics, etc.
- Keep descriptions concise: 1-2 sentences per topic maximum
- types: required, optional, or advanced
- resources: exactly 2 real URLs per topic
- all ids unique
PROMPT;
    }

    private function buildCategoriesPrompt(string $language): string
    {
        return <<<PROMPT
List all the major specialization categories for {$language} developers.

Return ONLY a raw JSON object. No markdown. No backticks. No explanation.

Structure:
{
  "categories": [
    { "name": "Web Frameworks", "icon": "🌐" },
    { "name": "CMS & E-commerce", "icon": "🛒" }
  ]
}

Rules:
- Include every category where {$language} has frameworks, libraries or tools with a real community
- Be specific to {$language} — don't add categories where {$language} has no presence
- 8-20 categories depending on the ecosystem size
PROMPT;
    }

    private function buildCategoryPathsPrompt(string $language, string $category, string $categoryIcon): string
    {
        return <<<PROMPT
List every framework, library, and tool in the "{$category}" category for {$language}.

Return ONLY a raw JSON object. No markdown. No backticks. No explanation.

Structure:
{
  "paths": [
    {
      "id": "path-laravel",
      "label": "Laravel",
      "icon": "🚀",
      "category": "{$category}",
      "category_icon": "{$categoryIcon}"
    }
  ]
}

Rules:
- Be exhaustive — include mainstream AND niche options in {$category} for {$language}
- Maximum 25 entries — pick the most relevant and widely used ones
- Every entry must be a real framework/library/tool with actual users
- All ids unique, lowercase, prefixed with "path-", no spaces (use hyphens)
PROMPT;
    }

    private function parseJson(string $content): ?array
    {
        $content = trim($content);

        $decoded = json_decode($content, true);
        if (json_last_error() === JSON_ERROR_NONE) return $decoded;

        $clean = preg_replace('/^```(?:json)?\s*/m', '', $content);
        $clean = preg_replace('/\s*```\s*$/m', '', $clean);
        $decoded = json_decode(trim($clean), true);
        if (json_last_error() === JSON_ERROR_NONE) return $decoded;

        if (preg_match('/\{[\s\S]*\}/m', $content, $matches)) {
            $decoded = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) return $decoded;
        }

        return null;
    }
}

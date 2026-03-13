<?php

namespace App\Http\Controllers;

use App\Models\Roadmap;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RoadmapController extends Controller
{
    public function show(string $language)
    {
        $roadmap = Roadmap::where('language', $language)->first();

        if ($roadmap) {
            return response()->json(array_merge(
                ['language' => $roadmap->language, 'generated_at' => $roadmap->generated_at],
                $roadmap->data
            ));
        }

        try {
            $data = $this->generate($language);

            Roadmap::create([
                'language'     => $language,
                'data'         => $data,
                'generated_at' => now(),
            ]);

            return response()->json(array_merge(['language' => $language], $data));
        } catch (\Exception $e) {
            Log::error('Roadmap generation failed', ['language' => $language, 'error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to generate roadmap'], 500);
        }
    }

    public function refresh(string $language)
    {
        try {
            $data = $this->generate($language);

            Roadmap::updateOrCreate(
                ['language' => $language],
                ['data' => $data, 'generated_at' => now()]
            );

            return response()->json(array_merge(['language' => $language], $data));
        } catch (\Exception $e) {
            Log::error('Roadmap refresh failed', ['language' => $language, 'error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to refresh roadmap'], 500);
        }
    }

    private function generate(string $language): array
    {
        $apiKey = config('services.anthropic.key');

        $response = Http::withHeaders([
            'x-api-key'         => $apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type'      => 'application/json',
        ])->timeout(90)->post('https://api.anthropic.com/v1/messages', [
            'model'       => 'claude-sonnet-4-20250514',
            'max_tokens'  => 4000,
            'temperature' => 0,
            'messages'    => [
                [
                    'role'    => 'user',
                    'content' => "Generate a complete learning roadmap for the programming language: {$language}.
Return ONLY a raw JSON object. No markdown. No backticks. No explanation. No text before or after.
Use exactly this structure:
{\"phases\":[{\"id\":\"phase-1\",\"label\":\"Phase Title\",\"description\":\"Brief description\",\"order\":0,\"topics\":[{\"id\":\"topic-1\",\"label\":\"Topic Name\",\"description\":\"Brief description of what to learn\",\"type\":\"required\",\"resources\":[\"https://real-url-1.com\",\"https://real-url-2.com\"],\"links_to\":[]}]}]}
Rules:
- types must be one of: required, optional, advanced
- resources must be 2-3 real, working URLs per topic (official docs, MDN, tutorials, articles)
- include 4-6 phases with 5-8 topics each
- links_to contains ids of prerequisite topics",
                ],
            ],
        ]);

        if ($response->failed()) {
            Log::error('Anthropic API error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            throw new \Exception('Claude API request failed: ' . $response->status());
        }

        $content = $response->json('content.0.text');
        $decoded = $this->parseJson($content);

        if (! $decoded) {
            Log::error('Invalid JSON from Claude', ['language' => $language, 'content' => substr($content, 0, 500)]);
            throw new \Exception('Invalid JSON from Claude API');
        }

        return $decoded;
    }

    private function parseJson(string $content): ?array
    {
        $content = trim($content);

        // 1. Try direct parse
        $decoded = json_decode($content, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }

        // 2. Strip ```json ... ``` fences
        $clean = preg_replace('/^```(?:json)?\s*/m', '', $content);
        $clean = preg_replace('/\s*```\s*$/m', '', $clean);
        $decoded = json_decode(trim($clean), true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }

        // 3. Extract first {...} block
        if (preg_match('/\{[\s\S]*\}/m', $content, $matches)) {
            $decoded = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $decoded;
            }
        }

        return null;
    }
}

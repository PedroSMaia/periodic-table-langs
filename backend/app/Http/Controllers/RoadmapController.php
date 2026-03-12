<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class RoadmapController extends Controller
{
    /**
     * Return the learning roadmap for a given language.
     * Cached for 24 hours to avoid unnecessary API calls.
     */
    public function show(string $language)
    {
        $key = 'roadmap:' . strtolower($language);

        $data = Cache::remember($key, now()->addHours(24), function () use ($language) {
            return $this->generate($language);
        });

        if ($data === null) {
            return response()->json(['error' => 'Failed to generate roadmap'], 500);
        }

        return response()->json($data);
    }

    /**
     * Clear the cached roadmap for a language (useful for admin refresh).
     */
    public function refresh(string $language)
    {
        $key = 'roadmap:' . strtolower($language);
        Cache::forget($key);
        return response()->json(['message' => 'Cache cleared for ' . $language]);
    }

    /**
     * Call Claude API to generate a structured roadmap JSON.
     */
    private function generate(string $language): ?array
    {
        $prompt = <<<PROMPT
Generate a comprehensive learning roadmap for the {$language} programming language.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):

{
  "language": "{$language}",
  "phases": [
    {
      "id": "phase_id",
      "label": "Phase Label",
      "description": "Short description of this phase",
      "order": 0,
      "topics": [
        {
          "id": "unique_topic_id",
          "label": "Topic Name",
          "description": "1-2 sentence description of what to learn",
          "type": "required",
          "links_to": ["other_topic_id"]
        }
      ]
    }
  ]
}

Rules:
- "type" must be one of: "required", "optional", "advanced"
- "links_to" is an array of topic IDs this topic connects to (can be empty)
- Include 5-6 phases total (e.g. Fundamentals, Core Concepts, Advanced Topics, Ecosystem & Tools, Best Practices, Career Path)
- Each phase should have 4-8 topics
- "links_to" should form a logical learning progression (a topic links to what you should learn next)
- Cross-phase links are allowed
- IDs must be lowercase, underscored, unique
- Keep descriptions concise and practical
- Return only the JSON, nothing else
PROMPT;

        try {
            $response = Http::withHeaders([
                'x-api-key'         => config('services.anthropic.key'),
                'anthropic-version' => '2023-06-01',
                'content-type'      => 'application/json',
            ])->timeout(60)->post('https://api.anthropic.com/v1/messages', [
                'model'      => 'claude-sonnet-4-20250514',
                'max_tokens' => 4096,
                'messages'   => [
                    ['role' => 'user', 'content' => $prompt],
                ],
            ]);

            if (!$response->successful()) {
                \Log::error('Anthropic API error', ['status' => $response->status(), 'body' => $response->body()]);
                return null;
            }

            $body    = $response->json();
            $content = $body['content'][0]['text'] ?? '';

            // Strip any accidental markdown fences
            $content = preg_replace('/^```(?:json)?\s*/m', '', $content);
            $content = preg_replace('/\s*```$/m', '', $content);
            $content = trim($content);

            $data = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                \Log::error('Roadmap JSON parse error', ['error' => json_last_error_msg(), 'raw' => $content]);
                return null;
            }

            return $data;
        } catch (\Exception $e) {
            \Log::error('Roadmap generation exception', ['message' => $e->getMessage()]);
            return null;
        }
    }
}

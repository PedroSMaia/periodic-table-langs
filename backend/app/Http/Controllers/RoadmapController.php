<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateRoadmapJob;
use App\Models\Roadmap;
use App\Models\RoadmapPath;
use Illuminate\Http\Request;

class RoadmapController extends Controller
{
    // ── GET /api/roadmap/{language} ───────────────────────────────────────────
    public function show(string $language)
    {
        $roadmap = Roadmap::where('language', $language)->first();

        if (! $roadmap) {
            return response()->json(['language' => $language, 'status' => 'not_cached'], 404);
        }

        $status = $roadmap->data['status'] ?? 'ready';

        if ($status !== 'ready') {
            return response()->json(['language' => $language, 'status' => $status]);
        }

        $cachedPathIds = RoadmapPath::where('language', $language)
            ->pluck('path_id')
            ->flip()
            ->toArray();

        $data = $roadmap->data;
        $data['paths'] = array_map(function ($path) use ($cachedPathIds) {
            $path['status'] = array_key_exists($path['id'], $cachedPathIds)
                ? 'cached'
                : 'not_cached';
            return $path;
        }, $data['paths'] ?? []);

        return response()->json(array_merge(
            ['language' => $roadmap->language, 'status' => 'ready', 'generated_at' => $roadmap->generated_at],
            $data
        ));
    }

    // ── GET /api/roadmap/{language}/path/{pathId} — read-only ─────────────────
    public function showPath(string $language, string $pathId)
    {
        $cached = RoadmapPath::where('language', $language)->where('path_id', $pathId)->first();

        if ($cached && ($cached->data['status'] ?? 'ready') === 'ready') {
            return response()->json($cached->data);
        }

        // Not generated — never auto-generate from frontend
        $status = $cached ? ($cached->data['status'] ?? 'not_cached') : 'not_cached';
        return response()->json(['status' => $status], 404);
    }

    // ── POST /api/roadmap/{language}/refresh — Admin only ─────────────────────
    public function refresh(string $language)
    {
        $roadmap = Roadmap::where('language', $language)->first();

        if ($roadmap && ($roadmap->data['status'] ?? '') === 'generating') {
            return response()->json(['language' => $language, 'status' => 'generating']);
        }

        Roadmap::where('language', $language)->delete();
        RoadmapPath::where('language', $language)->delete();

        GenerateRoadmapJob::dispatch($language);

        return response()->json(['language' => $language, 'status' => 'generating']);
    }
}

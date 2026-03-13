<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateRoadmapJob;
use App\Jobs\GenerateRoadmapPathJob;
use App\Models\Roadmap;
use App\Models\RoadmapPath;
use Illuminate\Support\Facades\Log;

class RoadmapController extends Controller
{
    // ── GET /api/roadmap/{language} ───────────────────────────────────────────
    public function show(string $language)
    {
        $roadmap = Roadmap::where('language', $language)->first();

        // Not in DB yet — create placeholder and dispatch job
        if (! $roadmap) {
            Roadmap::create([
                'language'     => $language,
                'data'         => ['status' => 'generating', 'core' => [], 'paths' => []],
                'generated_at' => now(),
            ]);
            GenerateRoadmapJob::dispatch($language);
            return response()->json(['language' => $language, 'status' => 'generating']);
        }

        $status = $roadmap->data['status'] ?? 'ready';

        if ($status !== 'ready') {
            return response()->json(['language' => $language, 'status' => $status]);
        }

        return response()->json(array_merge(
            ['language' => $roadmap->language, 'status' => 'ready', 'generated_at' => $roadmap->generated_at],
            $roadmap->data
        ));
    }

    // ── GET /api/roadmap/{language}/path/{pathId} ─────────────────────────────
    public function showPath(string $language, string $pathId)
    {
        $cached = RoadmapPath::where('language', $language)->where('path_id', $pathId)->first();

        // Already ready
        if ($cached && ($cached->data['status'] ?? 'ready') === 'ready') {
            return response()->json($cached->data);
        }

        // Already generating
        if ($cached && ($cached->data['status'] ?? '') === 'generating') {
            return response()->json(['status' => 'generating']);
        }

         // Failed — allow retry
         if ($cached && ($cached->data['status'] ?? '') === 'failed') {
             $cached->delete();
         }

        // Get path stub from main roadmap
        $roadmap = Roadmap::where('language', $language)->first();
        if (! $roadmap || ($roadmap->data['status'] ?? '') !== 'ready') {
            return response()->json(['error' => 'Roadmap not ready'], 404);
        }

        $pathStub = collect($roadmap->data['paths'] ?? [])->firstWhere('id', $pathId);
        if (! $pathStub) {
            return response()->json(['error' => 'Path not found'], 404);
        }

        // Dispatch job and create placeholder
        RoadmapPath::updateOrCreate(
            ['language' => $language, 'path_id' => $pathId],
            [
            'language'     => $language,
            'path_id'      => $pathId,
            'data'         => ['status' => 'generating'],
            'generated_at' => now(),
        ]);
        GenerateRoadmapPathJob::dispatch($language, $pathId, $pathStub);

        return response()->json(['status' => 'generating']);
    }

    // ── POST /api/roadmap/{language}/refresh ──────────────────────────────────
    public function refresh(string $language)
    {
        // Delete existing data
        Roadmap::where('language', $language)->delete();
        RoadmapPath::where('language', $language)->delete();

        // Dispatch fresh generation
        GenerateRoadmapJob::dispatch($language);

        return response()->json(['language' => $language, 'status' => 'generating']);
    }
}

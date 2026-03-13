<?php

namespace App\Http\Controllers;

use App\Models\UserProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $entries = UserProgress::where('user_id', $request->user()->id)->get();

        $result = [];
        foreach ($entries as $entry) {
            $result[$entry->language] = [
                'completed_topics'  => $entry->completed_topics ?? [],
                'selected_path_id'  => $entry->selected_path_id,
            ];
        }

        return response()->json($result);
    }

    public function upsert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'language'         => 'required|string|max:100',
            'completed_topics' => 'present|array',
            'completed_topics.*' => 'string',
            'selected_path_id' => 'nullable|string|max:255',
        ]);

        UserProgress::updateOrCreate(
            [
                'user_id'  => $request->user()->id,
                'language' => $validated['language'],
            ],
            [
                'completed_topics' => $validated['completed_topics'],
                'selected_path_id' => $validated['selected_path_id'] ?? null,
            ]
        );

        return response()->json(['message' => 'Saved.']);
    }
}

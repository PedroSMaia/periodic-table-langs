<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class MetricsController extends Controller
{
    public function index(): JsonResponse
    {
        $path = storage_path('app/metrics.json');

        if (!file_exists($path)) {
            return response()->json(['error' => 'metrics.json not found'], 404);
        }

        $data = json_decode(file_get_contents($path), true);

        return response()->json([
            'tiobe'    => $data['tiobe']    ?? [],
            'so_loved' => $data['so_loved'] ?? [],
            'so_used'  => $data['so_used']  ?? [],
            'ratings'  => $data['ratings']  ?? [],
            'meta'     => $data['_meta']    ?? [],
        ]);
    }
}

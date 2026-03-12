<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\MetricsController;
use App\Http\Controllers\RoadmapController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('languages', LanguageController::class);
Route::get('/metrics', [MetricsController::class, 'index']);
Route::get('/roadmap/{language}', [RoadmapController::class, 'show']);
Route::post('/roadmap/{language}/refresh', [RoadmapController::class, 'refresh']);

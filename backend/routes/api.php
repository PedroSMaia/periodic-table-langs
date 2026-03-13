<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\MetricsController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\RoadmapController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('languages', LanguageController::class);
Route::get('/metrics', [MetricsController::class, 'index']);

// Auth routes (public)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

// Auth routes (authenticated)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
    Route::get('/progress',     [ProgressController::class, 'index']);
    Route::post('/progress',    [ProgressController::class, 'upsert']);
});

// Public read-only routes
Route::get('/roadmap/{language}/path/{pathId}', [RoadmapController::class, 'showPath']);
Route::get('/roadmap/{language}', [RoadmapController::class, 'show']);

// Admin-only routes (protected by API key)
Route::middleware('admin.api_key')->group(function () {
    Route::post('/roadmap/{language}/refresh', [RoadmapController::class, 'refresh']);
});

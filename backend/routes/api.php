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

// Languages: public read, admin-only write
Route::apiResource('languages', LanguageController::class)->only(['index', 'show']);
Route::apiResource('languages', LanguageController::class)->only(['store', 'update', 'destroy'])->middleware('admin.api_key');
Route::get('/metrics', [MetricsController::class, 'index']);

// Auth routes (public, rate limited)
Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/auth/login',    [AuthController::class, 'login'])->middleware('throttle:5,1');

// Auth routes (authenticated)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
    Route::get('/progress',     [ProgressController::class, 'index']);
    Route::post('/progress',    [ProgressController::class, 'upsert']);
});

// Public read-only routes (allow encoded slashes in language names like PL/SQL)
Route::get('/roadmap/{language}/path/{pathId}', [RoadmapController::class, 'showPath'])
    ->where('language', '.*(?<!path)');
Route::get('/roadmap/{language}', [RoadmapController::class, 'show'])
    ->where('language', '.+');

// Admin-only routes (protected by API key)
Route::middleware('admin.api_key')->group(function () {
    Route::post('/roadmap/{language}/refresh', [RoadmapController::class, 'refresh'])
        ->where('language', '.+');
});

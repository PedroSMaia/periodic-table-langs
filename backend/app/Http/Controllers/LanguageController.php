<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLanguageRequest;
use App\Http\Requests\UpdateLanguageRequest;
use App\Models\Language;
use Illuminate\Http\JsonResponse;

class LanguageController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Language::all());
    }

    public function store(StoreLanguageRequest $request): JsonResponse
    {
        $language = Language::create($request->validated());

        return response()->json($language, 201);
    }

    public function show(Language $language): JsonResponse
    {
        return response()->json($language);
    }

    public function update(UpdateLanguageRequest $request, Language $language): JsonResponse
    {
        $language->update($request->validated());

        return response()->json($language);
    }

    public function destroy(Language $language): JsonResponse
    {
        $language->delete();

        return response()->json(null, 204);
    }
}

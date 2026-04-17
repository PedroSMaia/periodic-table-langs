<?php

namespace Tests\Feature;

use App\Models\Language;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LanguageApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_languages(): void
    {
        Language::create([
            'sym' => 'Py',
            'name' => 'Python',
            'cat' => 'general',
            'year' => 1991,
            'paradigm' => 'Multi-paradigm',
            'desc' => 'A general-purpose language.',
        ]);

        $response = $this->getJson('/api/languages');

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'Python']);
    }

    public function test_can_show_single_language(): void
    {
        $lang = Language::create([
            'sym' => 'Py',
            'name' => 'Python',
            'cat' => 'general',
            'year' => 1991,
            'paradigm' => 'Multi-paradigm',
            'desc' => 'A general-purpose language.',
        ]);

        $response = $this->getJson('/api/languages/' . $lang->id);

        $response->assertOk()
            ->assertJson(['name' => 'Python']);
    }

    public function test_store_requires_admin_api_key(): void
    {
        $response = $this->postJson('/api/languages', [
            'sym' => 'Rs',
            'name' => 'Rust',
            'cat' => 'systems',
            'year' => 2010,
            'paradigm' => 'Multi-paradigm',
            'desc' => 'A systems language.',
        ]);

        $response->assertStatus(401);
    }
}

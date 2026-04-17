<?php

namespace Tests\Feature;

use App\Models\Language;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProgressTest extends TestCase
{
    use RefreshDatabase;

    private function authHeader(User $user): array
    {
        $token = $user->createToken('site')->plainTextToken;
        return ['Authorization' => 'Bearer ' . $token];
    }

    public function test_progress_requires_authentication(): void
    {
        $this->getJson('/api/progress')->assertStatus(401);
        $this->postJson('/api/progress', [])->assertStatus(401);
    }

    public function test_can_save_and_retrieve_progress(): void
    {
        $user = User::factory()->create();
        Language::create([
            'sym' => 'Py', 'name' => 'Python', 'cat' => 'general',
            'year' => 1991, 'paradigm' => 'Multi-paradigm', 'desc' => 'Test',
        ]);

        $this->withHeaders($this->authHeader($user))
            ->postJson('/api/progress', [
                'language' => 'Python',
                'completed_topics' => ['variables', 'loops'],
                'selected_path_id' => 'beginner',
            ])
            ->assertOk();

        $response = $this->withHeaders($this->authHeader($user))
            ->getJson('/api/progress');

        $response->assertOk()
            ->assertJsonFragment(['completed_topics' => ['variables', 'loops']]);
    }

    public function test_progress_validates_language_exists(): void
    {
        $user = User::factory()->create();

        $response = $this->withHeaders($this->authHeader($user))
            ->postJson('/api/progress', [
                'language' => 'NonExistent',
                'completed_topics' => [],
                'selected_path_id' => null,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('language');
    }

    public function test_progress_upserts_existing_entry(): void
    {
        $user = User::factory()->create();
        Language::create([
            'sym' => 'Py', 'name' => 'Python', 'cat' => 'general',
            'year' => 1991, 'paradigm' => 'Multi-paradigm', 'desc' => 'Test',
        ]);

        $headers = $this->authHeader($user);

        $this->withHeaders($headers)->postJson('/api/progress', [
            'language' => 'Python',
            'completed_topics' => ['variables'],
            'selected_path_id' => null,
        ])->assertOk();

        $this->withHeaders($headers)->postJson('/api/progress', [
            'language' => 'Python',
            'completed_topics' => ['variables', 'loops', 'functions'],
            'selected_path_id' => 'advanced',
        ])->assertOk();

        $response = $this->withHeaders($headers)->getJson('/api/progress');
        $response->assertOk();

        $data = $response->json();
        $this->assertCount(3, $data['Python']['completed_topics']);
        $this->assertEquals('advanced', $data['Python']['selected_path_id']);
    }
}

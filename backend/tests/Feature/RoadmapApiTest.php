<?php

namespace Tests\Feature;

use App\Models\Roadmap;
use App\Models\RoadmapPath;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoadmapApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_roadmap_returns_404_for_unknown_language(): void
    {
        $response = $this->getJson('/api/roadmap/Unknown');

        $response->assertStatus(404)
            ->assertJson(['status' => 'not_cached']);
    }

    public function test_roadmap_returns_data_when_cached(): void
    {
        Roadmap::create([
            'language' => 'Python',
            'data' => [
                'status' => 'ready',
                'description' => 'Python roadmap',
                'paths' => [
                    ['id' => 'beginner', 'title' => 'Beginner Path'],
                ],
            ],
            'generated_at' => now(),
        ]);

        $response = $this->getJson('/api/roadmap/Python');

        $response->assertOk()
            ->assertJson(['language' => 'Python', 'status' => 'ready']);
    }

    public function test_roadmap_path_returns_404_when_not_cached(): void
    {
        $response = $this->getJson('/api/roadmap/Python/path/beginner');

        $response->assertStatus(404)
            ->assertJson(['status' => 'not_cached']);
    }

    public function test_roadmap_path_returns_data_when_cached(): void
    {
        RoadmapPath::create([
            'language' => 'Python',
            'path_id' => 'beginner',
            'data' => [
                'status' => 'ready',
                'title' => 'Beginner Path',
                'phases' => [],
            ],
        ]);

        $response = $this->getJson('/api/roadmap/Python/path/beginner');

        $response->assertOk()
            ->assertJson(['status' => 'ready']);
    }

    public function test_refresh_requires_admin_api_key(): void
    {
        $response = $this->postJson('/api/roadmap/Python/refresh');

        $response->assertStatus(401);
    }
}

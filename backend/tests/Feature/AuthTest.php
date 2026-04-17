<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password1',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']]);

        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_register_requires_strong_password(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'weak',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    public function test_register_requires_unique_email(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'taken@example.com',
            'password' => 'Password1',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_user_can_login(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'Password1',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Password1',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']]);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'Password1',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'WrongPass1',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('site')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/auth/logout');

        $response->assertOk()
            ->assertJson(['message' => 'Logged out.']);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('site')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/auth/me');

        $response->assertOk()
            ->assertJson(['user' => ['id' => $user->id, 'email' => $user->email]]);
    }

    public function test_me_requires_authentication(): void
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(401);
    }
}

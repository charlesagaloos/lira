<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminLoginRedirectTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_without_an_artist_profile_is_sent_to_admin_dashboard_even_with_an_intended_artist_url(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin-only@example.com',
            'is_admin' => true,
        ]);

        $this->withSession([
            'url.intended' => route('dashboard'),
        ])->post(route('login.store'), [
            'email' => $admin->email,
            'password' => 'password',
        ])
            ->assertRedirect(route('admin.dashboard'));

        $this->assertAuthenticatedAs($admin);
    }

    public function test_admin_with_an_artist_profile_keeps_the_artist_dashboard_redirect(): void
    {
        $admin = User::factory()->create([
            'email' => 'artist-admin@example.com',
            'is_admin' => true,
        ]);

        ArtistProfile::create([
            'user_id' => $admin->id,
            'username' => 'artist-admin',
            'display_name' => 'Artist Admin',
        ]);

        $this->post(route('login.store'), [
            'email' => $admin->email,
            'password' => 'password',
        ])->assertRedirect(route('dashboard'));

        $this->assertAuthenticatedAs($admin);
    }

    public function test_non_admin_login_keeps_the_existing_artist_dashboard_redirect(): void
    {
        $user = User::factory()->create([
            'email' => 'artist@example.com',
        ]);

        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ])->assertRedirect(route('dashboard'));

        $this->assertAuthenticatedAs($user);
    }
}

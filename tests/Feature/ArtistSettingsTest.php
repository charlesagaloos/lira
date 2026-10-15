<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ArtistSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_artist_can_view_dashboard_appearance_settings(): void
    {
        $user = User::factory()->create();
        ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'settings-artist',
            'display_name' => 'Settings Artist',
            'avatar' => 'avatars/settings-artist.png',
        ]);

        $this->actingAs($user)
            ->get(route('artist-settings.edit'))
            ->assertOk()
            ->assertInertia(
                fn (Assert $page) => $page
                    ->component('Settings/ArtistSettings')
                    ->where('dashboardTheme', 'dark')
                    ->where('artistDashboardTheme', 'dark')
                    ->where('profile.avatar', 'avatars/settings-artist.png')
                    ->has('profile.avatar_zoom')
            );
    }

    public function test_artist_can_save_a_dashboard_theme_preference(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch(route('artist-settings.update'), [
                'dashboard_theme' => 'light',
            ])
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'dashboard_theme' => 'light',
        ]);

        $this->actingAs($user)
            ->get(route('artist-settings.edit'))
            ->assertInertia(
                fn (Assert $page) => $page
                    ->where('dashboardTheme', 'light')
                    ->where('artistDashboardTheme', 'light')
            );
    }

    public function test_artist_cannot_save_an_unknown_dashboard_theme(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch(route('artist-settings.update'), [
                'dashboard_theme' => 'neon',
            ])
            ->assertSessionHasErrors('dashboard_theme');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'dashboard_theme' => 'dark',
        ]);
    }

    public function test_guest_cannot_update_dashboard_appearance_settings(): void
    {
        $this->patch(route('artist-settings.update'), [
            'dashboard_theme' => 'light',
        ])->assertRedirect(route('login'));
    }
}

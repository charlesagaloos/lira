<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\User;
use App\VerificationStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminArtistPasswordSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        return User::factory()->create([
            'is_admin' => true,
        ]);
    }

    private function createArtist(): array
    {
        $user = User::factory()->create([
            'password' => Hash::make('original-password'),
        ]);

        $profile = ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'security-test-artist',
            'display_name' => 'Security Test Artist',
            'verification_status' => VerificationStatus::Verified,
        ]);

        return [$user, $profile];
    }

    private function updatePayload(User $user, array $overrides = []): array
    {
        return array_merge([
            'name' => $user->name,
            'email' => $user->email,
            'password' => '',
            'password_confirmation' => '',
            'is_admin' => (bool) $user->is_admin,
            'verification_status' => 'verified',
        ], $overrides);
    }

    public function test_admin_cannot_set_password_shorter_than_eight_characters(): void
    {
        $admin = $this->createAdmin();
        [$artist, $profile] = $this->createArtist();
        $originalHash = $artist->password;

        $this->actingAs($admin)
            ->put(route('admin.artists.update', $artist), $this->updatePayload($artist, [
                'password' => 'short',
                'password_confirmation' => 'short',
            ]))
            ->assertSessionHasErrors('password');

        $this->assertSame($originalHash, $artist->fresh()->password);
    }

    public function test_admin_can_update_artist_password_with_valid_confirmation(): void
    {
        $admin = $this->createAdmin();
        [$artist] = $this->createArtist();

        $this->actingAs($admin)
            ->put(route('admin.artists.update', $artist), $this->updatePayload($artist, [
                'password' => 'new-secure-password',
                'password_confirmation' => 'new-secure-password',
            ]))
            ->assertRedirect(route('admin.artists.edit', [
                'profile' => $artist->artistProfile->id,
            ]));

        $this->assertTrue(Hash::check('new-secure-password', $artist->fresh()->password));
    }

    public function test_admin_can_leave_artist_password_unchanged(): void
    {
        $admin = $this->createAdmin();
        [$artist] = $this->createArtist();
        $originalHash = $artist->password;

        $this->actingAs($admin)
            ->put(route('admin.artists.update', $artist), $this->updatePayload($artist))
            ->assertRedirect(route('admin.artists.edit', [
                'profile' => $artist->artistProfile->id,
            ]));

        $this->assertSame($originalHash, $artist->fresh()->password);
    }

    public function test_admin_cannot_update_artist_password_with_mismatched_confirmation(): void
    {
        $admin = $this->createAdmin();
        [$artist] = $this->createArtist();
        $originalHash = $artist->password;

        $this->actingAs($admin)
            ->put(route('admin.artists.update', $artist), $this->updatePayload($artist, [
                'password' => 'new-secure-password',
                'password_confirmation' => 'different-password',
            ]))
            ->assertSessionHasErrors('password');

        $this->assertSame($originalHash, $artist->fresh()->password);
    }
}

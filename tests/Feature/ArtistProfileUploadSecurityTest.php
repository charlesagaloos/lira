<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\User;
use App\Services\ImageModerationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ArtistProfileUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_avatar_is_deleted_if_profile_update_fails(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $profile = ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'avatar-cleanup',
            'display_name' => 'Avatar Cleanup Artist',
        ]);

        $oldAvatar = 'artist-avatars/old-avatar.jpg';

        Storage::disk('public')->put($oldAvatar, 'original avatar');

        $profile->update([
            'avatar' => $oldAvatar,
        ]);

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $eventName = 'eloquent.saving: ' . ArtistProfile::class;

        Event::listen($eventName, function (): void {
            throw new \RuntimeException(
                'Simulated profile save failure.',
            );
        });

        try {
            $this->withoutExceptionHandling();

            try {
                $this->actingAs($user)->put(
                    route('profile.update'),
                    [
                        'avatar' => UploadedFile::fake()->image('new-avatar.jpg'),
                        'username' => 'avatar-cleanup',
                        'display_name' => 'Avatar Cleanup Artist',
                    ],
                );

                $this->fail('Expected the simulated profile save failure.');
            } catch (\RuntimeException $exception) {
                $this->assertSame(
                    'Simulated profile save failure.',
                    $exception->getMessage(),
                );
            }
        } finally {
            Event::forget($eventName);
        }

        $this->assertSame(
            $oldAvatar,
            $profile->fresh()->avatar,
        );

        Storage::disk('public')->assertExists($oldAvatar);

        $this->assertSame(
            [$oldAvatar],
            Storage::disk('public')->allFiles('artist-avatars'),
        );
    }
    public function test_artist_cannot_update_another_artists_profile(): void
    {
        $attacker = User::factory()->create();
        $owner = User::factory()->create();

        $profile = ArtistProfile::create([
            'user_id' => $owner->id,
            'username' => 'profile-owner',
            'display_name' => 'Original Display Name',
        ]);

        $this->actingAs($attacker)
            ->put(route('profile.update'), [
                'username' => 'profile-owner',
                'display_name' => 'Unauthorized Change',
            ])
            ->assertNotFound();

        $this->assertDatabaseHas('artist_profiles', [
            'id' => $profile->id,
            'user_id' => $owner->id,
            'display_name' => 'Original Display Name',
        ]);
    }
    public function test_profile_update_cannot_change_owner_or_verification_status(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $profile = ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'protected-profile',
            'display_name' => 'Original Artist',
        ]);

        $this->actingAs($user)
            ->put(route('profile.update'), [
                'username' => 'protected-profile',
                'display_name' => 'Updated Artist',
                'user_id' => $otherUser->id,
                'verification_status' => 'verified',
            ])
            ->assertRedirect(route('profile.edit'));

        $this->assertDatabaseHas('artist_profiles', [
            'id' => $profile->id,
            'user_id' => $user->id,
            'username' => 'protected-profile',
            'display_name' => 'Updated Artist',
        ]);

        $this->assertNotSame(
            'verified',
            $profile->fresh()->verification_status instanceof \App\VerificationStatus
            ? $profile->fresh()->verification_status->value
            : $profile->fresh()->verification_status,
        );
    }
}

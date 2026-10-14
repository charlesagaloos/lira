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

class ArtistProfileCreationSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_avatar_is_deleted_if_profile_creation_fails(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $eventName = 'eloquent.creating: ' . ArtistProfile::class;

        Event::listen($eventName, function (): void {
            throw new \RuntimeException(
                'Simulated profile creation failure.',
            );
        });

        try {
            $this->withoutExceptionHandling();

            try {
                $this->actingAs($user)->post(
                    route('profile.store'),
                    [
                        'avatar' => UploadedFile::fake()->image('new-avatar.jpg'),
                        'username' => 'creation-cleanup',
                        'display_name' => 'Creation Cleanup Artist',
                    ],
                );

                $this->fail('Expected the simulated profile creation failure.');
            } catch (\RuntimeException $exception) {
                $this->assertSame(
                    'Simulated profile creation failure.',
                    $exception->getMessage(),
                );
            }
        } finally {
            Event::forget($eventName);
        }

        $this->assertDatabaseCount('artist_profiles', 0);

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('artist-avatars'),
        );
    }
}

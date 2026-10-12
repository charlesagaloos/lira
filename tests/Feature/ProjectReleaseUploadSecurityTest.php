<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\PortfolioSetting;
use App\Models\Release;
use App\Models\User;
use App\Services\ImageModerationService;
use App\VerificationStatus;
use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectReleaseUploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function createVerifiedArtist(string $username): array
    {
        $user = User::factory()->create();

        $profile = ArtistProfile::create([
            'user_id' => $user->id,
            'username' => $username,
            'display_name' => $username,
            'verification_status' => VerificationStatus::Verified,
        ]);

        PortfolioSetting::create([
            'artist_profile_id' => $profile->id,
        ]);

        return [$user, $profile];
    }

    private function validProjectPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Security Test Project',
            'description' => 'Upload security test',
            'project_type' => 'Artwork',
            'url' => 'https://example.com/project',
            'thumbnail_position_x' => 50,
            'thumbnail_position_y' => 50,
            'thumbnail_zoom' => 100,
            'thumbnail_offset_x' => 0,
            'thumbnail_offset_y' => 0,
        ], $overrides);
    }

    private function validReleasePayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Security Test Release',
            'release_type' => 'single',
            'is_visible' => true,
        ], $overrides);
    }

    public function test_project_rejects_svg_before_image_moderation(): void
    {
        Storage::fake('public');

        [$user] = $this->createVerifiedArtist('project-svg-test');

        $this->mock(ImageModerationService::class)
            ->shouldNotReceive('check');

        $this->actingAs($user)
            ->from(route('projects.index'))
            ->post(route('projects.store'), $this->validProjectPayload([
                'image' => UploadedFile::fake()->create(
                    'malicious.svg',
                    10,
                    'image/svg+xml'
                ),
            ]))
            ->assertSessionHasErrors('image');

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('projects')
        );
    }

    public function test_release_rejects_svg_before_image_moderation(): void
    {
        Storage::fake('public');

        [$user] = $this->createVerifiedArtist('release-svg-test');

        $this->mock(ImageModerationService::class)
            ->shouldNotReceive('check');

        $this->actingAs($user)
            ->from(route('releases.index'))
            ->post(route('releases.store'), $this->validReleasePayload([
                'artwork' => UploadedFile::fake()->create(
                    'malicious.svg',
                    10,
                    'image/svg+xml'
                ),
            ]))
            ->assertSessionHasErrors('artwork');

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('release-artwork')
        );
    }

    public function test_oversized_project_thumbnail_is_rejected_before_moderation(): void
    {
        Storage::fake('public');

        [$user] = $this->createVerifiedArtist('project-size-test');

        $this->mock(ImageModerationService::class)
            ->shouldNotReceive('check');

        $this->actingAs($user)
            ->from(route('projects.index'))
            ->post(route('projects.store'), $this->validProjectPayload([
                'image' => UploadedFile::fake()
                    ->image('large.jpg')
                    ->size(15361),
            ]))
            ->assertSessionHasErrors('image');

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('projects')
        );
    }

    public function test_oversized_release_artwork_is_rejected_before_moderation(): void
    {
        Storage::fake('public');

        [$user] = $this->createVerifiedArtist('release-size-test');

        $this->mock(ImageModerationService::class)
            ->shouldNotReceive('check');

        $this->actingAs($user)
            ->from(route('releases.index'))
            ->post(route('releases.store'), $this->validReleasePayload([
                'artwork' => UploadedFile::fake()
                    ->image('large.jpg', 600, 600)
                    ->size(5121),
            ]))
            ->assertSessionHasErrors('artwork');

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('release-artwork')
        );
    }

    public function test_rejected_project_thumbnail_is_not_stored(): void
    {
        Storage::fake('public');

        [$user] = $this->createVerifiedArtist('project-moderation-test');

        $this->mock(ImageModerationService::class)
            ->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => false,
                'message' => 'Unable to verify the image. Please try again.',
            ]);

        $this->actingAs($user)
            ->from(route('projects.index'))
            ->post(route('projects.store'), $this->validProjectPayload([
                'image' => UploadedFile::fake()->image('rejected.jpg'),
            ]))
            ->assertSessionHasErrors('image');

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('projects')
        );
    }

    public function test_rejected_release_artwork_is_not_stored(): void
    {
        Storage::fake('public');

        [$user] = $this->createVerifiedArtist('release-moderation-test');

        $this->mock(ImageModerationService::class)
            ->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => false,
                'message' => 'Unable to verify the image. Please try again.',
            ]);

        $this->actingAs($user)
            ->from(route('releases.index'))
            ->post(route('releases.store'), $this->validReleasePayload([
                'artwork' => UploadedFile::fake()->image(
                    'rejected.jpg',
                    600,
                    600
                ),
            ]))
            ->assertSessionHasErrors('artwork');

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('release-artwork')
        );
    }

    public function test_approved_project_thumbnail_is_stored(): void
    {
        Storage::fake('public');

        [$user, $profile] = $this->createVerifiedArtist('project-approved-test');

        $this->mock(ImageModerationService::class)
            ->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $this->actingAs($user)
            ->post(route('projects.store'), $this->validProjectPayload([
                'image' => UploadedFile::fake()->image('approved.jpg'),
            ]))
            ->assertRedirect(route('projects.index'))
            ->assertSessionHasNoErrors();

        $project = $profile->projects()->firstOrFail();

        $this->assertStringStartsWith('projects/', $project->thumbnail);
        Storage::disk('public')->assertExists($project->thumbnail);
    }

    public function test_approved_release_artwork_is_stored(): void
    {
        Storage::fake('public');

        [$user, $profile] = $this->createVerifiedArtist('release-approved-test');

        $this->mock(ImageModerationService::class)
            ->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $this->actingAs($user)
            ->post(route('releases.store'), $this->validReleasePayload([
                'artwork' => UploadedFile::fake()->image(
                    'approved.jpg',
                    600,
                    600
                ),
            ]))
            ->assertRedirect(route('releases.index'))
            ->assertSessionHasNoErrors();

        $release = $profile->releases()->firstOrFail();

        $this->assertStringStartsWith(
            'release-artwork/',
            $release->artwork
        );

        Storage::disk('public')->assertExists($release->artwork);
    }
    public function test_rejected_project_thumbnail_replacement_preserves_old_image(): void
    {
        Storage::fake('public');

        [$user, $profile] = $this->createVerifiedArtist('project-replace-rejected');

        $oldImage = UploadedFile::fake()->image('old.jpg')->store('projects', 'public');

        $project = $profile->projects()->create([
            ...$this->validProjectPayload(),
            'thumbnail' => $oldImage,
            'slug' => 'existing-project',
            'position' => 1,
            'is_visible' => true,
        ]);

        $this->mock(ImageModerationService::class)
            ->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => false,
                'message' => 'Image rejected.',
            ]);

        $this->actingAs($user)
            ->from(route('projects.index'))
            ->put(route('projects.update', $project->id), $this->validProjectPayload([
                'image' => UploadedFile::fake()->image('replacement.jpg'),
            ]))
            ->assertSessionHasErrors('image');

        Storage::disk('public')->assertExists($oldImage);
        $this->assertSame($oldImage, $project->fresh()->thumbnail);
        $this->assertCount(1, Storage::disk('public')->allFiles('projects'));
    }

    public function test_approved_project_thumbnail_replacement_deletes_old_image(): void
    {
        Storage::fake('public');

        [$user, $profile] = $this->createVerifiedArtist('project-replace-approved');

        $oldImage = UploadedFile::fake()->image('old.jpg')->store('projects', 'public');

        $project = $profile->projects()->create([
            ...$this->validProjectPayload(),
            'thumbnail' => $oldImage,
            'slug' => 'existing-project',
            'position' => 1,
            'is_visible' => true,
        ]);

        $this->mock(ImageModerationService::class)
            ->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $this->actingAs($user)
            ->put(route('projects.update', $project->id), $this->validProjectPayload([
                'image' => UploadedFile::fake()->image('replacement.jpg'),
            ]))
            ->assertRedirect(route('projects.index'))
            ->assertSessionHasNoErrors();

        $newImage = $project->fresh()->thumbnail;

        $this->assertNotSame($oldImage, $newImage);
        Storage::disk('public')->assertMissing($oldImage);
        Storage::disk('public')->assertExists($newImage);
        $this->assertCount(1, Storage::disk('public')->allFiles('projects'));
    }

    public function test_rejected_release_artwork_replacement_preserves_old_image(): void
    {
        Storage::fake('public');

        [$user, $profile] = $this->createVerifiedArtist('release-replace-rejected');

        $oldArtwork = UploadedFile::fake()
            ->image('old.jpg', 600, 600)
            ->store('release-artwork', 'public');

        $release = $profile->releases()->create([
            ...$this->validReleasePayload(),
            'artwork' => $oldArtwork,
            'position' => 1,
        ]);

        $this->mock(ImageModerationService::class)
            ->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => false,
                'message' => 'Artwork rejected.',
            ]);

        $this->actingAs($user)
            ->from(route('releases.index'))
            ->put(route('releases.update', $release->id), $this->validReleasePayload([
                'artwork' => UploadedFile::fake()->image(
                    'replacement.jpg',
                    600,
                    600
                ),
            ]))
            ->assertSessionHasErrors('artwork');

        Storage::disk('public')->assertExists($oldArtwork);
        $this->assertSame($oldArtwork, $release->fresh()->artwork);
        $this->assertCount(1, Storage::disk('public')->allFiles('release-artwork'));
    }

    public function test_approved_release_artwork_replacement_deletes_old_image(): void
    {
        Storage::fake('public');

        [$user, $profile] = $this->createVerifiedArtist('release-replace-approved');

        $oldArtwork = UploadedFile::fake()
            ->image('old.jpg', 600, 600)
            ->store('release-artwork', 'public');

        $release = $profile->releases()->create([
            ...$this->validReleasePayload(),
            'artwork' => $oldArtwork,
            'position' => 1,
        ]);

        $this->mock(ImageModerationService::class)
            ->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $this->actingAs($user)
            ->put(route('releases.update', $release->id), $this->validReleasePayload([
                'artwork' => UploadedFile::fake()->image(
                    'replacement.jpg',
                    600,
                    600
                ),
            ]))
            ->assertRedirect(route('releases.index'))
            ->assertSessionHasNoErrors();

        $newArtwork = $release->fresh()->artwork;

        $this->assertNotSame($oldArtwork, $newArtwork);
        Storage::disk('public')->assertMissing($oldArtwork);
        Storage::disk('public')->assertExists($newArtwork);
        $this->assertCount(1, Storage::disk('public')->allFiles('release-artwork'));
    }
    public function test_uploaded_project_thumbnail_is_deleted_if_creation_fails(): void
    {
        Storage::fake('public');

        [$user] = $this->createVerifiedArtist('project-create-failure');

        $this->mock(ImageModerationService::class)
            ->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $eventName = 'eloquent.creating: ' . \App\Models\Project::class;

        Event::listen($eventName, function (): void {
            throw new \RuntimeException(
                'Simulated project creation failure.',
            );
        });

        try {
            $this->withoutExceptionHandling();

            try {
                $this->actingAs($user)->post(
                    route('projects.store'),
                    $this->validProjectPayload([
                        'image' => UploadedFile::fake()->image('artwork.jpg'),
                    ]),
                );

                $this->fail('Expected project creation to fail.');
            } catch (\RuntimeException $exception) {
                $this->assertSame(
                    'Simulated project creation failure.',
                    $exception->getMessage(),
                );
            }
        } finally {
            Event::forget($eventName);
        }

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('projects'),
        );
    }

    public function test_uploaded_release_artwork_is_deleted_if_creation_fails(): void
    {
        Storage::fake('public');

        [$user, $profile] = $this->createVerifiedArtist('release-create-failure');

        $this->mock(ImageModerationService::class)
            ->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $eventName = 'eloquent.creating: ' . Release::class;

        Event::listen($eventName, function (): void {
            throw new \RuntimeException(
                'Simulated release creation failure.',
            );
        });

        try {
            $this->withoutExceptionHandling();

            try {
                $this->actingAs($user)->post(
                    route('releases.store'),
                    $this->validReleasePayload([
                        'artwork' => UploadedFile::fake()->image(
                            'artwork.jpg',
                            600,
                            600,
                        ),
                    ]),
                );

                $this->fail('Expected release creation to fail.');
            } catch (\RuntimeException $exception) {
                $this->assertSame(
                    'Simulated release creation failure.',
                    $exception->getMessage(),
                );
            }
        } finally {
            Event::forget($eventName);
        }

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('release-artwork'),
        );

        $this->assertDatabaseMissing('releases', [
            'artist_profile_id' => $profile->id,
            'title' => $this->validReleasePayload()['title'],
        ]);
    }

}


<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\PortfolioGalleryImage;
use App\Models\PortfolioSetting;
use App\Models\User;
use App\Services\ImageModerationService;
use App\VerificationStatus;
use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GalleryUploadSecurityTest extends TestCase
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

        $settings = PortfolioSetting::create([
            'artist_profile_id' => $profile->id,
        ]);

        return [$user, $profile, $settings];
    }

    private function createGalleryImage(
        PortfolioSetting $settings,
        string $path = 'artist-gallery/existing.jpg',
    ): PortfolioGalleryImage {
        return PortfolioGalleryImage::create([
            'portfolio_setting_id' => $settings->id,
            'image' => $path,
            'title' => 'Existing artwork',
            'caption' => 'Original caption',
            'alt_text' => 'Original artwork',
            'sort_order' => 0,
        ]);
    }

    public function test_artist_cannot_edit_another_artists_gallery_image(): void
    {
        [$userA] = $this->createVerifiedArtist('gallery-owner-a');
        [, , $settingsB] = $this->createVerifiedArtist('gallery-owner-b');
        $image = $this->createGalleryImage($settingsB);

        $this->actingAs($userA)
            ->get(route('gallery.edit', $image))
            ->assertNotFound();
    }

    public function test_artist_cannot_update_another_artists_gallery_image(): void
    {
        [$userA] = $this->createVerifiedArtist('gallery-update-a');
        [, , $settingsB] = $this->createVerifiedArtist('gallery-update-b');
        $image = $this->createGalleryImage($settingsB);

        Storage::fake('public');

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldNotReceive('check');

        $this->actingAs($userA)
            ->put(route('gallery.update', $image), [
                'title' => 'Hijacked title',
            ])
            ->assertNotFound();

        $this->assertDatabaseHas('portfolio_gallery_images', [
            'id' => $image->id,
            'portfolio_setting_id' => $settingsB->id,
            'title' => 'Existing artwork',
        ]);
    }

    public function test_artist_cannot_delete_another_artists_gallery_image(): void
    {
        [$userA] = $this->createVerifiedArtist('gallery-delete-a');
        [, , $settingsB] = $this->createVerifiedArtist('gallery-delete-b');
        $image = $this->createGalleryImage($settingsB);

        Storage::fake('public');
        Storage::disk('public')->put($image->image, 'existing image');

        $this->actingAs($userA)
            ->delete(route('gallery.destroy', $image))
            ->assertNotFound();

        $this->assertDatabaseHas('portfolio_gallery_images', [
            'id' => $image->id,
            'portfolio_setting_id' => $settingsB->id,
        ]);

        Storage::disk('public')->assertExists($image->image);
    }

    public function test_svg_gallery_upload_is_rejected_before_moderation(): void
    {
        Storage::fake('public');

        [$user] = $this->createVerifiedArtist('gallery-svg');

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldNotReceive('check');

        $this->actingAs($user)
            ->from(route('gallery.create'))
            ->post(route('gallery.store'), [
                'image' => UploadedFile::fake()->create(
                    'malicious.svg',
                    10,
                    'image/svg+xml',
                ),
            ])
            ->assertSessionHasErrors('image');

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('artist-gallery'),
        );

        $this->assertDatabaseCount('portfolio_gallery_images', 0);
    }

    public function test_oversized_gallery_upload_is_rejected_before_moderation(): void
    {
        Storage::fake('public');

        [$user] = $this->createVerifiedArtist('gallery-oversized');

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldNotReceive('check');

        $this->actingAs($user)
            ->from(route('gallery.create'))
            ->post(route('gallery.store'), [
                'image' => UploadedFile::fake()
                    ->image('large.jpg')
                    ->size(10241),
            ])
            ->assertSessionHasErrors('image');

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('artist-gallery'),
        );

        $this->assertDatabaseCount('portfolio_gallery_images', 0);
    }

    public function test_rejected_gallery_upload_is_not_stored(): void
    {
        Storage::fake('public');

        [$user] = $this->createVerifiedArtist('gallery-rejected');

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => false,
                'message' => 'This image contains inappropriate content.',
            ]);

        $this->actingAs($user)
            ->from(route('gallery.create'))
            ->post(route('gallery.store'), [
                'image' => UploadedFile::fake()->image('rejected.jpg'),
            ])
            ->assertSessionHasErrors('image');

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('artist-gallery'),
        );

        $this->assertDatabaseCount('portfolio_gallery_images', 0);
    }

    public function test_approved_gallery_upload_is_stored_successfully(): void
    {
        Storage::fake('public');

        [$user, , $settings] = $this->createVerifiedArtist('gallery-approved');

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $this->actingAs($user)
            ->post(route('gallery.store'), [
                'image' => UploadedFile::fake()->image('artwork.jpg'),
                'title' => 'My artwork',
                'caption' => 'A test artwork',
                'alt_text' => 'Artwork on display',
            ])
            ->assertRedirect(route('gallery.index'))
            ->assertSessionHas('success', 'Gallery image added successfully.');

        $this->assertDatabaseHas('portfolio_gallery_images', [
            'portfolio_setting_id' => $settings->id,
            'title' => 'My artwork',
            'caption' => 'A test artwork',
            'alt_text' => 'Artwork on display',
            'sort_order' => 0,
        ]);

        $image = PortfolioGalleryImage::where(
            'portfolio_setting_id',
            $settings->id,
        )->firstOrFail();

        $this->assertStringStartsWith('artist-gallery/', $image->image);
        Storage::disk('public')->assertExists($image->image);
    }

    public function test_rejected_gallery_replacement_preserves_original_image(): void
    {
        Storage::fake('public');

        [$user, , $settings] = $this->createVerifiedArtist('gallery-replacement');

        $image = $this->createGalleryImage(
            $settings,
            'artist-gallery/original.jpg',
        );

        Storage::disk('public')->put($image->image, 'original image bytes');

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => false,
                'message' => 'This image contains inappropriate content.',
            ]);

        $this->actingAs($user)
            ->from(route('gallery.edit', $image))
            ->put(route('gallery.update', $image), [
                'image' => UploadedFile::fake()->image('replacement.jpg'),
                'title' => 'Replacement artwork',
            ])
            ->assertSessionHasErrors('image');

        $this->assertDatabaseHas('portfolio_gallery_images', [
            'id' => $image->id,
            'image' => 'artist-gallery/original.jpg',
            'title' => 'Existing artwork',
        ]);

        Storage::disk('public')->assertExists('artist-gallery/original.jpg');

        $this->assertSame(
            ['artist-gallery/original.jpg'],
            Storage::disk('public')->allFiles('artist-gallery'),
        );
    }
    public function test_uploaded_gallery_file_is_deleted_if_database_creation_fails(): void
    {
        Storage::fake('public');

        [$user] = $this->createVerifiedArtist(
            'gallery-database-failure',
        );

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $eventName = 'eloquent.creating: ' . PortfolioGalleryImage::class;

        Event::listen($eventName, function (): void {
            throw new \RuntimeException(
                'Simulated gallery creation failure.',
            );
        });

        try {
            $this->withoutExceptionHandling();

            try {
                $this->actingAs($user)->post(route('gallery.store'), [
                    'image' => UploadedFile::fake()->image('artwork.jpg'),
                    'title' => 'Artwork',
                ]);

                $this->fail('Expected gallery creation to fail.');
            } catch (\RuntimeException $exception) {
                $this->assertSame(
                    'Simulated gallery creation failure.',
                    $exception->getMessage(),
                );
            }
        } finally {
            Event::forget($eventName);
        }

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('artist-gallery'),
        );

        $this->assertDatabaseCount('portfolio_gallery_images', 0);
    }

}

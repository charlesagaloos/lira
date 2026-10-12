<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\PortfolioGalleryImage;
use App\Models\PortfolioNavigationItem;
use App\Models\PortfolioSetting;
use App\Models\Release;
use App\Models\User;
use App\VerificationStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Services\ImageModerationService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Filesystem\Filesystem;
use Tests\TestCase;

class PortfolioSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_portfolio_settings(): void
    {
        $this->get(route('portfolio.settings.edit'))
            ->assertRedirect(route('login'));
    }

    public function test_user_without_artist_profile_is_redirected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('portfolio.settings.edit'))
            ->assertRedirect(route('profile.create'));
    }

    public function test_unverified_artist_cannot_access_portfolio_settings(): void
    {
        $user = User::factory()->create();

        $profile = ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'pending-artist',
            'display_name' => 'Pending Artist',
            'verification_status' => VerificationStatus::Pending,
        ]);

        $this->actingAs($user)
            ->get(route('portfolio.settings.edit'))
            ->assertRedirect(route('dashboard'))
            ->assertSessionHas(
                'error',
                'Your artist profile must be verified before you can access this section.'
            );
    }

    public function test_verified_artist_can_access_own_portfolio_settings(): void
    {
        $user = User::factory()->create();

        $profile = ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'verified-artist',
            'display_name' => 'Verified Artist',
            'verification_status' => VerificationStatus::Verified,
        ]);

        PortfolioSetting::create([
            'artist_profile_id' => $profile->id,
        ]);

        $this->actingAs($user)
            ->get(route('portfolio.settings.edit'))
            ->assertOk();
    }
    public function test_omitting_navigation_items_preserves_existing_items(): void
    {
        [$user, $profile, $settings] = $this->createVerifiedArtist(
            'navigation-omitted'
        );

        $existingItem = PortfolioNavigationItem::create([
            'portfolio_setting_id' => $settings->id,
            'label' => 'My Work',
            'destination' => 'work',
            'url' => null,
            'sort_order' => 0,
            'is_visible' => true,
        ]);

        $payload = $this->validSettingsPayload();
        unset($payload['navigation_items']);

        $this->actingAs($user)
            ->put(route('portfolio.settings.update'), $payload)
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('portfolio_navigation_items', [
            'id' => $existingItem->id,
            'portfolio_setting_id' => $settings->id,
            'label' => 'My Work',
        ]);
    }

    public function test_submitting_empty_navigation_items_removes_existing_items(): void
    {
        [$user, $profile, $settings] = $this->createVerifiedArtist(
            'navigation-empty'
        );

        $existingItem = PortfolioNavigationItem::create([
            'portfolio_setting_id' => $settings->id,
            'label' => 'My Work',
            'destination' => 'work',
            'url' => null,
            'sort_order' => 0,
            'is_visible' => true,
        ]);

        $this->actingAs($user)
            ->put(
                route('portfolio.settings.update'),
                $this->validSettingsPayload([
                    'navigation_items' => [],
                ]),
            )
            ->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('portfolio_navigation_items', [
            'id' => $existingItem->id,
        ]);
    }
    public function test_external_navigation_rejects_javascript_url(): void
    {
        [$user] = $this->createVerifiedArtist('external-js-url');

        $this->actingAs($user)
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'navigation_items' => [
                    [
                        'label' => 'Malicious Link',
                        'destination' => 'external',
                        'url' => 'javascript:alert(1)',
                        'sort_order' => 0,
                        'is_visible' => true,
                    ],
                ],
            ]))
            ->assertSessionHasErrors([
                'navigation_items.0.url',
            ]);
    }

    public function test_internal_navigation_rejects_external_url(): void
    {
        [$user] = $this->createVerifiedArtist('internal-with-url');

        $this->actingAs($user)
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'navigation_items' => [
                    [
                        'label' => 'Work',
                        'destination' => 'work',
                        'url' => 'https://example.com',
                        'sort_order' => 0,
                        'is_visible' => true,
                    ],
                ],
            ]))
            ->assertSessionHasErrors([
                'navigation_items.0.url',
            ]);
    }

    public function test_external_navigation_accepts_valid_https_url(): void
    {
        [$user, $profile, $settings] = $this->createVerifiedArtist(
            'valid-external-url'
        );

        $this->actingAs($user)
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'navigation_items' => [
                    [
                        'label' => 'My Website',
                        'destination' => 'external',
                        'url' => 'https://example.com/portfolio',
                        'sort_order' => 0,
                        'is_visible' => true,
                    ],
                ],
            ]))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('portfolio_navigation_items', [
            'portfolio_setting_id' => $settings->id,
            'label' => 'My Website',
            'destination' => 'external',
            'url' => 'https://example.com/portfolio',
        ]);
    }
    public function test_artist_cannot_update_another_artists_navigation_item(): void
    {
        [$userA, $profileA, $settingsA] = $this->createVerifiedArtist(
            'artist-a'
        );

        [$userB, $profileB, $settingsB] = $this->createVerifiedArtist(
            'artist-b'
        );

        $foreignItem = PortfolioNavigationItem::create([
            'portfolio_setting_id' => $settingsB->id,
            'label' => 'Artist B Link',
            'destination' => 'work',
            'url' => null,
            'sort_order' => 0,
            'is_visible' => true,
        ]);

        $this->actingAs($userA)
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'navigation_items' => [
                    [
                        'id' => $foreignItem->id,
                        'label' => 'Hijacked Link',
                        'destination' => 'work',
                        'url' => null,
                        'sort_order' => 0,
                        'is_visible' => true,
                    ]
                ],
            ]))
            ->assertNotFound();

        $this->assertDatabaseHas('portfolio_navigation_items', [
            'id' => $foreignItem->id,
            'portfolio_setting_id' => $settingsB->id,
            'label' => 'Artist B Link',
        ]);
    }

    public function test_artist_cannot_reorder_another_artists_gallery_image(): void
    {
        [$userA, $profileA, $settingsA] = $this->createVerifiedArtist(
            'gallery-a'
        );

        [$userB, $profileB, $settingsB] = $this->createVerifiedArtist(
            'gallery-b'
        );

        // Artist A needs one gallery image so the submitted item count matches.
        PortfolioGalleryImage::create([
            'portfolio_setting_id' => $settingsA->id,
            'image' => 'portfolio/gallery/artist-a.jpg',
            'title' => 'Artist A Image',
            'sort_order' => 0,
        ]);

        $foreignImage = PortfolioGalleryImage::create([
            'portfolio_setting_id' => $settingsB->id,
            'image' => 'portfolio/gallery/artist-b.jpg',
            'title' => 'Artist B Image',
            'sort_order' => 7,
        ]);

        $this->actingAs($userA)
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'gallery_order' => [
                    [
                        'id' => $foreignImage->id,
                        'sort_order' => 0,
                    ]
                ],
            ]))
            ->assertStatus(422);

        $this->assertDatabaseHas('portfolio_gallery_images', [
            'id' => $foreignImage->id,
            'portfolio_setting_id' => $settingsB->id,
            'sort_order' => 7,
        ]);
    }

    public function test_artist_cannot_feature_another_artists_release(): void
    {
        [$userA, $profileA, $settingsA] = $this->createVerifiedArtist(
            'release-a'
        );

        [$userB, $profileB, $settingsB] = $this->createVerifiedArtist(
            'release-b'
        );

        $foreignRelease = Release::create([
            'artist_profile_id' => $profileB->id,
            'title' => 'Artist B Release',
            'release_type' => 'single',
            'is_visible' => true,
            'position' => 0,
        ]);

        $this->actingAs($userA)
            ->from(route('portfolio.settings.edit'))
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'featured_release_id' => $foreignRelease->id,
            ]))
            ->assertSessionHasErrors('featured_release_id');

        $this->assertDatabaseMissing('portfolio_settings', [
            'id' => $settingsA->id,
            'featured_release_id' => $foreignRelease->id,
        ]);

        $this->assertDatabaseHas('releases', [
            'id' => $foreignRelease->id,
            'artist_profile_id' => $profileB->id,
            'title' => 'Artist B Release',
        ]);
    }

    /**
     * Create a verified artist with default portfolio settings.
     */

    public function test_artist_cannot_submit_duplicate_gallery_image_ids(): void
    {
        [$user, $profile, $settings] = $this->createVerifiedArtist(
            'duplicate-gallery'
        );

        $image = PortfolioGalleryImage::create([
            'portfolio_setting_id' => $settings->id,
            'image' => 'portfolio/gallery/image-a.jpg',
            'title' => 'Image A',
            'sort_order' => 0,
        ]);

        $this->actingAs($user)
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'gallery_order' => [
                    ['id' => $image->id, 'sort_order' => 0],
                    ['id' => $image->id, 'sort_order' => 1],
                ],
            ]))
            ->assertSessionHasErrors([
                'gallery_order.0.id',
                'gallery_order.1.id',
            ]);

        $this->assertDatabaseHas('portfolio_gallery_images', [
            'id' => $image->id,
            'portfolio_setting_id' => $settings->id,
            'sort_order' => 0,
        ]);
    }

    public function test_artist_cannot_omit_an_existing_gallery_image_when_reordering(): void
    {
        [$user, $profile, $settings] = $this->createVerifiedArtist(
            'incomplete-gallery'
        );

        $imageA = PortfolioGalleryImage::create([
            'portfolio_setting_id' => $settings->id,
            'image' => 'portfolio/gallery/image-a.jpg',
            'title' => 'Image A',
            'sort_order' => 0,
        ]);

        $imageB = PortfolioGalleryImage::create([
            'portfolio_setting_id' => $settings->id,
            'image' => 'portfolio/gallery/image-b.jpg',
            'title' => 'Image B',
            'sort_order' => 1,
        ]);

        $this->actingAs($user)
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'gallery_order' => [
                    ['id' => $imageA->id, 'sort_order' => 0],
                ],
            ]))
            ->assertStatus(422);

        $this->assertDatabaseHas('portfolio_gallery_images', [
            'id' => $imageA->id,
            'sort_order' => 0,
        ]);

        $this->assertDatabaseHas('portfolio_gallery_images', [
            'id' => $imageB->id,
            'sort_order' => 1,
        ]);
    }

    public function test_invalid_template_does_not_update_portfolio_settings(): void
    {
        [$user, $profile, $settings] = $this->createVerifiedArtist(
            'invalid-template'
        );

        $settings->refresh();
        $originalTemplate = $settings->template;

        $this->actingAs($user)
            ->from(route('portfolio.settings.edit'))
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'template' => 'unauthorized-template',
            ]))
            ->assertSessionHasErrors('template');

        $this->assertDatabaseHas('portfolio_settings', [
            'id' => $settings->id,
            'template' => $originalTemplate,
        ]);
    }

    public function test_invalid_color_does_not_update_portfolio_settings(): void
    {
        [$user, $profile, $settings] = $this->createVerifiedArtist(
            'invalid-color'
        );

        $settings->refresh();
        $originalColor = $settings->background_color;

        $this->actingAs($user)
            ->from(route('portfolio.settings.edit'))
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'background_color' => 'not-a-hex-color',
            ]))
            ->assertSessionHasErrors('background_color');

        $this->assertDatabaseHas('portfolio_settings', [
            'id' => $settings->id,
            'background_color' => $originalColor,
        ]);
    }

    public function test_rejected_cover_image_is_not_stored(): void
    {
        Storage::fake('public');

        [$user, $profile, $settings] = $this->createVerifiedArtist(
            'rejected-cover'
        );

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => false,
                'message' => 'This image contains inappropriate content.',
            ]);

        $file = UploadedFile::fake()->image('cover.jpg');

        $this->actingAs($user)
            ->from(route('portfolio.settings.edit'))
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'cover_image' => $file,
            ]))
            ->assertRedirect(route('portfolio.settings.edit'))
            ->assertSessionHasErrors('cover_image');

        $this->assertDatabaseHas('artist_profiles', [
            'id' => $profile->id,
            'cover_image' => null,
        ]);

        $this->assertSame([], Storage::disk('public')->allFiles('portfolio/covers'));
    }

    public function test_rejected_footer_logo_is_not_stored(): void
    {
        Storage::fake('public');

        [$user, $profile, $settings] = $this->createVerifiedArtist(
            'rejected-footer-logo'
        );

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => false,
                'message' => 'This image contains inappropriate content.',
            ]);

        $file = UploadedFile::fake()->image('footer-logo.png');

        $this->actingAs($user)
            ->from(route('portfolio.settings.edit'))
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'footer_logo' => $file,
            ]))
            ->assertRedirect(route('portfolio.settings.edit'))
            ->assertSessionHasErrors('footer_logo');

        $settings->refresh();

        $this->assertNull($settings->footer_logo);
        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('portfolio/footer-logos')
        );
    }

    public function test_cover_image_moderation_failure_prevents_storage(): void
    {
        Storage::fake('public');

        [$user, $profile] = $this->createVerifiedArtist(
            'moderation-failure'
        );

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => false,
                'message' => 'Unable to verify the image. Please try again.',
            ]);

        $this->actingAs($user)
            ->from(route('portfolio.settings.edit'))
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'cover_image' => UploadedFile::fake()->image('cover.jpg'),
            ]))
            ->assertSessionHasErrors('cover_image');

        $this->assertNull($profile->fresh()->cover_image);
        $this->assertSame([], Storage::disk('public')->allFiles('portfolio/covers'));
    }

    public function test_approved_cover_image_is_stored_successfully(): void
    {
        Storage::fake('public');

        [$user, $profile] = $this->createVerifiedArtist(
            'approved-cover'
        );

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->once()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $this->actingAs($user)
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'cover_image' => UploadedFile::fake()->image('cover.jpg'),
            ]))
            ->assertRedirect(route('portfolio.settings.edit'))
            ->assertSessionHas(
                'success',
                'Portfolio settings updated successfully.'
            );

        $profile->refresh();

        $this->assertNotNull($profile->cover_image);

        Storage::disk('public')->assertExists($profile->cover_image);

        $this->assertStringStartsWith(
            'portfolio/covers/',
            $profile->cover_image
        );
    }

    public function test_invalid_cover_image_type_is_rejected_before_moderation(): void
    {
        Storage::fake('public');

        [$user, $profile] = $this->createVerifiedArtist(
            'invalid-cover-type'
        );

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldNotReceive('check');

        $this->actingAs($user)
            ->from(route('portfolio.settings.edit'))
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'cover_image' => UploadedFile::fake()->create(
                    'malicious.svg',
                    10,
                    'image/svg+xml'
                ),
            ]))
            ->assertRedirect(route('portfolio.settings.edit'))
            ->assertSessionHasErrors('cover_image');

        $this->assertNull($profile->fresh()->cover_image);

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('portfolio/covers')
        );
    }

    public function test_oversized_cover_image_is_rejected_before_moderation(): void
    {
        Storage::fake('public');

        [$user, $profile] = $this->createVerifiedArtist(
            'oversized-cover'
        );

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldNotReceive('check');

        $this->actingAs($user)
            ->from(route('portfolio.settings.edit'))
            ->put(route('portfolio.settings.update'), $this->validSettingsPayload([
                'cover_image' => UploadedFile::fake()->image('large.jpg')->size(5121),
            ]))
            ->assertRedirect(route('portfolio.settings.edit'))
            ->assertSessionHasErrors('cover_image');

        $this->assertNull($profile->fresh()->cover_image);

        $this->assertSame(
            [],
            Storage::disk('public')->allFiles('portfolio/covers')
        );
    }
    public function test_new_cover_and_footer_logo_are_cleaned_up_if_database_update_fails(): void
    {
        Storage::fake('public');

        [$user, $profile, $settings] = $this->createVerifiedArtist(
            'settings-db-failure'
        );

        $oldCover = 'portfolio/covers/old-cover.jpg';
        $oldLogo = 'portfolio/footer-logos/old-logo.png';

        Storage::disk('public')->put($oldCover, 'original cover');
        Storage::disk('public')->put($oldLogo, 'original logo');

        $profile->update(['cover_image' => $oldCover]);
        $settings->update(['footer_logo' => $oldLogo]);

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->twice()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);

        $eventName = 'eloquent.saving: App\\Models\\ArtistProfile';

        Event::listen($eventName, function (): void {
            throw new \RuntimeException('Simulated profile save failure.');
        });

        try {
            $this->withoutExceptionHandling();

            try {
                $this->actingAs($user)->put(
                    route('portfolio.settings.update'),
                    $this->validSettingsPayload([
                        'cover_image' => UploadedFile::fake()->image('new-cover.jpg'),
                        'footer_logo' => UploadedFile::fake()->image('new-logo.png'),
                    ])
                );

                $this->fail('Expected the simulated database update failure.');
            } catch (\RuntimeException $exception) {
                $this->assertSame(
                    'Simulated profile save failure.',
                    $exception->getMessage()
                );
            }
        } finally {
            Event::forget($eventName);
        }

        $this->assertSame($oldCover, $profile->fresh()->cover_image);
        $this->assertSame($oldLogo, $settings->fresh()->footer_logo);

        Storage::disk('public')->assertExists($oldCover);
        Storage::disk('public')->assertExists($oldLogo);

        $this->assertSame(
            [$oldCover],
            Storage::disk('public')->allFiles('portfolio/covers')
        );

        $this->assertSame(
            [$oldLogo],
            Storage::disk('public')->allFiles('portfolio/footer-logos')
        );
    }
    public function test_cover_image_is_cleaned_up_if_footer_logo_storage_fails(): void
    {
        Storage::fake('public');

        [$user, $profile, $settings] = $this->createVerifiedArtist(
            'footer-storage-failure'
        );

        $oldCover = 'portfolio/covers/old-cover.jpg';
        $oldLogo = 'portfolio/footer-logos/old-logo.png';

        Storage::disk('public')->put($oldCover, 'original cover');
        Storage::disk('public')->put($oldLogo, 'original logo');

        $profile->update(['cover_image' => $oldCover]);
        $settings->update(['footer_logo' => $oldLogo]);

        $moderation = $this->mock(ImageModerationService::class);
        $moderation->shouldReceive('check')
            ->twice()
            ->andReturn([
                'allowed' => true,
                'message' => null,
            ]);


        $disk = \Mockery::mock(\Illuminate\Contracts\Filesystem\Filesystem::class);

        $disk->shouldReceive('putFileAs')
            ->twice()
            ->andReturn(
                'portfolio/covers/new-cover.jpg',
                false
            );

        $disk->shouldReceive('delete')
            ->once()
            ->with('portfolio/covers/new-cover.jpg')
            ->andReturn(true);

        app('filesystem')->set('public', $disk);


        try {
            $this->withoutExceptionHandling();

            try {
                $this->actingAs($user)->put(
                    route('portfolio.settings.update'),
                    $this->validSettingsPayload([
                        'cover_image' => UploadedFile::fake()->image('new-cover.jpg'),
                        'footer_logo' => UploadedFile::fake()->image('new-logo.png'),
                    ])
                );

                $this->fail('Expected a RuntimeException when footer logo storage fails.');
            } catch (\RuntimeException $exception) {
                $this->assertSame(
                    'The footer logo could not be stored.',
                    $exception->getMessage()
                );
            }
        } finally {
            \Mockery::close();
        }

        $this->assertSame($oldCover, $profile->fresh()->cover_image);
        $this->assertSame($oldLogo, $settings->fresh()->footer_logo);
    }
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

    /**
     * Build a complete valid update payload, with optional overrides.
     */
    private function validSettingsPayload(array $overrides = []): array
    {
        $payload = [
            'template' => 'default',

            'primary_color' => '#ffffff',
            'background_color' => '#09090b',
            'text_color' => '#ffffff',
            'accent_color' => '#a1a1aa',
            'hover_color' => '#eeeeee',
            'surface_color' => '#18181b',
            'muted_text_color' => '#a1a1aa',
            'border_color' => '#27272a',

            'card_background_color' => '#18181b',
            'card_text_color' => '#ffffff',
            'card_accent_color' => '#a1a1aa',
            'card_primary_color' => '#ffffff',
            'card_hover_color' => '#27272a',

            'cover_image_position_x' => 50,
            'cover_image_position_y' => 50,
            'cover_image_zoom' => 1,
            'cover_image_offset_x' => 0,
            'cover_image_offset_y' => 0,

            'show_hero' => true,
            'show_work' => true,
            'show_about' => true,
            'show_artist_message' => true,
            'show_gallery' => true,
            'show_navigation' => true,
            'show_footer' => true,
            'show_footer_socials' => true,
            'show_powered_by_lira' => true,

            'show_music' => true,
            'show_music_links' => true,
            'music_label' => 'Music',
            'music_release_display' => 'latest',
            'music_release_limit' => 6,
            'featured_release_id' => null,

            'hero_label' => 'Welcome',
            'hero_statement' => 'Creative work.',
            'work_label' => 'Work',
            'work_description' => null,
            'about_label' => 'About',
            'artist_message_label' => 'Artist Message',
            'artist_message' => null,
            'canvas_background_text' => null,

            'gallery_label' => 'Gallery',
            'gallery_description' => null,
            'gallery_display' => 'grid',
            'gallery_columns' => 3,
            'gallery_image_aspect' => 'original',
            'gallery_show_captions' => true,
            'gallery_show_titles' => true,
            'gallery_enable_lightbox' => true,
            'gallery_responsive' => [
                'desktop' => [
                    'display' => 'grid',
                    'columns' => 3,
                    'image_aspect' => 'original',
                ],
                'tablet' => [
                    'display' => 'grid',
                    'columns' => 2,
                    'image_aspect' => 'original',
                ],
                'mobile' => [
                    'display' => 'grid',
                    'columns' => 1,
                    'image_aspect' => 'original',
                ],
            ],

            'navigation_items' => [],
            'gallery_order' => [],

            'footer_label' => 'Contact',
            'footer_message' => null,
            'copyright_text' => null,
            'remove_cover_image' => false,
            'remove_footer_logo' => false,
        ];

        return array_replace($payload, $overrides);
    }

}

<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\ArtistSocialLink;
use App\Models\PortfolioSetting;
use App\Models\User;
use App\VerificationStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicPortfolioPrivacyTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_portfolio_hides_internal_profile_fields_and_hidden_social_links(): void
    {
        $user = User::factory()->create();

        $profile = ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'privacy-artist',
            'display_name' => 'Privacy Artist',
            'verification_status' => VerificationStatus::Verified,
            'is_published' => true,
            'rejection_reason' => 'Internal moderation note',
        ]);

        PortfolioSetting::create([
            'artist_profile_id' => $profile->id,
        ]);

        ArtistSocialLink::create([
            'artist_profile_id' => $profile->id,
            'platform' => 'instagram',
            'url' => 'https://instagram.com/visible',
            'is_visible' => true,
        ]);

        ArtistSocialLink::create([
            'artist_profile_id' => $profile->id,
            'platform' => 'youtube',
            'url' => 'https://youtube.com/hidden',
            'is_visible' => false,
        ]);

        $this->get(route('portfolio.public', [
            'username' => 'privacy-artist',
        ]))
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component('Public/Portfolio')
                    ->has(
                        'profile',
                        fn(Assert $profileData) => $profileData
                            ->where('username', 'privacy-artist')
                            ->missing('user_id')
                            ->missing('rejection_reason')
                            ->missing('verification_status')
                            ->missing('verified_at')
                            ->has('social_links', 1)
                            ->where('social_links.0.platform', 'instagram')
                            ->missing('social_links.0.artist_profile_id')
                            ->etc()
                    )
            );
    }
    public function test_public_portfolio_excludes_hidden_navigation_items(): void
    {
        $user = User::factory()->create();

        $profile = ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'navigation-artist',
            'display_name' => 'Navigation Artist',
            'verification_status' => VerificationStatus::Verified,
            'is_published' => true,
        ]);

        $settings = PortfolioSetting::create([
            'artist_profile_id' => $profile->id,
            'show_navigation' => true,
        ]);

        \App\Models\PortfolioNavigationItem::create([
            'portfolio_setting_id' => $settings->id,
            'label' => 'Visible Item',
            'destination' => 'work',
            'is_visible' => true,
        ]);

        \App\Models\PortfolioNavigationItem::create([
            'portfolio_setting_id' => $settings->id,
            'label' => 'Hidden Item',
            'destination' => 'about',
            'is_visible' => false,
        ]);

        $this->get(route('portfolio.public', [
            'username' => 'navigation-artist',
        ]))
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->where(
                        'profile.portfolio_settings.navigation_items.0.label',
                        'Visible Item',
                    )
                    ->has('profile.portfolio_settings.navigation_items', 1)
                    ->missing(
                        'profile.portfolio_settings.navigation_items.0.portfolio_setting_id',
                    )
            );
    }
    public function test_public_project_hides_internal_profile_fields(): void
    {
        $user = User::factory()->create();

        $profile = ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'project-privacy-artist',
            'display_name' => 'Project Privacy Artist',
            'verification_status' => VerificationStatus::Verified,
            'is_published' => true,
            'rejection_reason' => 'Internal moderation note',
        ]);

        $project = $profile->projects()->create([
            'title' => 'Public Artwork',
            'slug' => 'public-artwork',
            'description' => 'A public project.',
            'project_type' => 'artwork',
            'is_visible' => true,
        ]);

        $this->get(route('portfolio.project', [
            'username' => $profile->username,
            'slug' => $project->slug,
        ]))
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component('Public/Project')
                    ->where('profile.username', 'project-privacy-artist')
                    ->where('project.title', 'Public Artwork')
                    ->missing('profile.user_id')
                    ->missing('profile.rejection_reason')
                    ->missing('profile.verification_status')
                    ->missing('project.artist_profile_id')
            );
    }

    public function test_owner_sees_unpublished_portfolio_status(): void
    {
        $user = User::factory()->create();

        ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'unpublished-artist',
            'display_name' => 'Unpublished Artist',
            'verification_status' => VerificationStatus::Verified,
            'is_published' => false,
        ]);

        $this->actingAs($user)
            ->get(route('portfolio.public', [
                'username' => 'unpublished-artist',
            ]))
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component('Public/PortfolioUnavailable')
                    ->where('username', 'unpublished-artist')
                    ->where('isOwner', true)
                    ->where('status', 'verified')
                    ->where('isPublished', false)
            );
    }

    public function test_guest_sees_generic_unavailable_page_without_verification_status(): void
    {
        $user = User::factory()->create();

        ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'pending-artist',
            'display_name' => 'Pending Artist',
            'verification_status' => VerificationStatus::Pending,
            'is_published' => true,
        ]);

        $this->get(route('portfolio.public', [
            'username' => 'pending-artist',
        ]))
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component('Public/PortfolioUnavailable')
                    ->where('username', 'pending-artist')
                    ->where('isOwner', false)
                    ->where('status', 'pending')
                    ->where('isPublished', true)
            );
    }
    public function test_unknown_public_portfolio_returns_404(): void
    {
        $this->get(route('portfolio.public', [
            'username' => 'unknown-artist',
        ]))->assertNotFound();
    }
    public function test_rejected_artist_sees_status_on_unavailable_page(): void
    {
        $user = User::factory()->create();

        ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'rejected-artist',
            'display_name' => 'Rejected Artist',
            'verification_status' => VerificationStatus::Rejected,
            'is_published' => false,
            'rejection_reason' => 'Internal moderation note',
        ]);

        $this->actingAs($user)
            ->get(route('portfolio.public', [
                'username' => 'rejected-artist',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/PortfolioUnavailable')
                ->where('isOwner', true)
                ->where('status', 'rejected')
                ->where('isPublished', false)
                ->missing('rejection_reason')
            );
    }
    public function test_verified_published_portfolio_remains_publicly_accessible(): void
    {
        $user = User::factory()->create();

        ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'published-artist',
            'display_name' => 'Published Artist',
            'verification_status' => VerificationStatus::Verified,
            'is_published' => true,
        ]);

        $this->get(route('portfolio.public', [
            'username' => 'published-artist',
        ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Portfolio')
                ->where('profile.username', 'published-artist')
                ->where('profile.display_name', 'Published Artist')
            );
    }
}


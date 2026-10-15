<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\User;
use App\VerificationStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicArtistDirectoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_directory_only_lists_verified_and_published_artists(): void
    {
        $visibleArtist = $this->createArtist('visible-artist', 'Visible Artist');
        $this->createArtist('pending-artist', 'Pending Artist', VerificationStatus::Pending);
        $this->createArtist('unpublished-artist', 'Unpublished Artist', isPublished: false);

        $this->get(route('artists.index'))
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page
                ->component('Artists/Index')
                ->where('artists.total', 1)
                ->where('artists.data.0.id', $visibleArtist->id)
                ->where('artists.data.0.username', 'visible-artist')
                ->has('artistTypes', 1)
                ->where('artistTypes.0', 'Musician')
                ->where('filters.search', '')
                ->where('filters.type', 'all'));
    }

    public function test_directory_searches_and_filters_public_artists(): void
    {
        $matchingArtist = $this->createArtist(
            'jazz-artist',
            'Blue Note',
            artistType: 'Musician',
            location: 'Toronto',
        );
        $this->createArtist(
            'visual-artist',
            'Blue Canvas',
            artistType: 'Photographer',
            location: 'Toronto',
        );
        $this->createArtist(
            'another-musician',
            'Different Name',
            artistType: 'Musician',
            location: 'Montreal',
        );

        $this->get(route('artists.index', [
            'search' => 'Toronto',
            'type' => 'Musician',
        ]))
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page
                ->component('Artists/Index')
                ->where('artists.total', 1)
                ->where('artists.data.0.id', $matchingArtist->id)
                ->where('filters.search', 'Toronto')
                ->where('filters.type', 'Musician'));
    }

    public function test_landing_page_orders_published_verified_artists_by_portfolio_views(): void
    {
        $popularArtist = $this->createArtist('popular-artist', 'Popular Artist');
        $newerArtist = $this->createArtist('newer-artist', 'Newer Artist');
        $unverifiedArtist = $this->createArtist(
            'unverified-artist',
            'Unverified Artist',
            VerificationStatus::Pending,
        );

        foreach (range(1, 3) as $_) {
            $popularArtist->portfolioViews()->create([
                'viewed_at' => now(),
            ]);
        }

        $unverifiedArtist->portfolioViews()->create([
            'viewed_at' => now(),
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page
                ->component('Home')
                ->where('artists.0.id', $popularArtist->id)
                ->where('artists.1.id', $newerArtist->id)
                ->has('artists', 2));
    }

    private function createArtist(
        string $username,
        string $displayName,
        VerificationStatus $status = VerificationStatus::Verified,
        bool $isPublished = true,
        string $artistType = 'Musician',
        ?string $location = null,
    ): ArtistProfile {
        return ArtistProfile::create([
            'user_id' => User::factory()->create()->id,
            'username' => $username,
            'display_name' => $displayName,
            'artist_type' => $artistType,
            'location' => $location,
            'verification_status' => $status,
            'is_published' => $isPublished,
        ]);
    }
}

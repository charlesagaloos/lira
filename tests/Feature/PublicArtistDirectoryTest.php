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

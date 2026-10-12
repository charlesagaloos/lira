<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\User;
use App\VerificationStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioPublishingTest extends TestCase
{
    use RefreshDatabase;

    private function createArtist(
        string $username,
        VerificationStatus $status,
        bool $published = false,
    ): array {
        $user = User::factory()->create();

        $profile = ArtistProfile::create([
            'user_id' => $user->id,
            'username' => $username,
            'display_name' => $username,
            'verification_status' => $status,
            'is_published' => $published,
        ]);

        return [$user, $profile];
    }

    public function test_verified_artist_can_publish_without_projects(): void
    {
        [$user, $profile] = $this->createArtist(
            'verified-no-projects',
            VerificationStatus::Verified,
        );

        $this->assertDatabaseCount('projects', 0);

        $this->actingAs($user)
            ->post(route('portfolio.publish'))
            ->assertRedirect(route('dashboard'))
            ->assertSessionHas('success', 'Portfolio published successfully.');

        $this->assertDatabaseHas('artist_profiles', [
            'id' => $profile->id,
            'is_published' => true,
        ]);
    }

    public function test_pending_artist_cannot_publish(): void
    {
        [$user, $profile] = $this->createArtist(
            'pending-publisher',
            VerificationStatus::Pending,
        );

        $this->actingAs($user)
            ->post(route('portfolio.publish'))
            ->assertRedirect(route('dashboard'))
            ->assertSessionHas(
                'error',
                'Your artist profile must be verified before you can access this section.',
            );

        $this->assertDatabaseHas('artist_profiles', [
            'id' => $profile->id,
            'is_published' => false,
        ]);
    }

    public function test_rejected_artist_cannot_publish(): void
    {
        [$user, $profile] = $this->createArtist(
            'rejected-publisher',
            VerificationStatus::Rejected,
        );

        $this->actingAs($user)
            ->post(route('portfolio.publish'))
            ->assertRedirect(route('dashboard'))
            ->assertSessionHas(
                'error',
                'Your artist profile must be verified before you can access this section.',
            );

        $this->assertDatabaseHas('artist_profiles', [
            'id' => $profile->id,
            'is_published' => false,
        ]);
    }

    public function test_rejected_artist_can_resubmit_profile(): void
    {
        [$user, $profile] = $this->createArtist(
            'resubmitting-artist',
            VerificationStatus::Rejected,
            true,
        );

        $profile->update([
            'verified_at' => now()->subDay(),
            'rejection_reason' => 'Please update your portfolio information.',
        ]);

        $this->actingAs($user)
            ->post(route('profile.resubmit'))
            ->assertRedirect(route('dashboard'))
            ->assertSessionHas(
                'success',
                'Your profile has been resubmitted for verification.',
            );

        $this->assertDatabaseHas('artist_profiles', [
            'id' => $profile->id,
            'verification_status' => VerificationStatus::Pending->value,
            'verified_at' => null,
            'rejection_reason' => null,
        ]);
    }

    public function test_verified_artist_cannot_resubmit_profile(): void
    {
        [$user, $profile] = $this->createArtist(
            'verified-resubmission',
            VerificationStatus::Verified,
        );

        $this->actingAs($user)
            ->post(route('profile.resubmit'))
            ->assertSessionHasErrors('verification');

        $this->assertDatabaseHas('artist_profiles', [
            'id' => $profile->id,
            'verification_status' => VerificationStatus::Verified->value,
        ]);
    }

    public function test_pending_artist_cannot_resubmit_profile(): void
    {
        [$user, $profile] = $this->createArtist(
            'pending-resubmission',
            VerificationStatus::Pending,
        );

        $this->actingAs($user)
            ->post(route('profile.resubmit'))
            ->assertSessionHasErrors('verification');

        $this->assertDatabaseHas('artist_profiles', [
            'id' => $profile->id,
            'verification_status' => VerificationStatus::Pending->value,
        ]);
    }

    public function test_user_without_profile_cannot_publish(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('portfolio.publish'))
            ->assertRedirect(route('profile.create'));
    }

    public function test_user_without_profile_cannot_resubmit(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('profile.resubmit'))
            ->assertNotFound();
    }
}

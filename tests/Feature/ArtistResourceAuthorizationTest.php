<?php

namespace Tests\Feature;

use App\VerificationStatus;
use App\Models\ArtistProfile;
use App\Models\PortfolioSetting;
use App\Models\Project;
use App\Models\Release;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArtistResourceAuthorizationTest extends TestCase
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

    private function createProject(ArtistProfile $profile): Project
    {
        return $profile->projects()->create([
            'title' => 'Original Project',
            'slug' => 'original-project',
            'description' => 'Original description',
            'project_type' => 'Artwork',
            'url' => 'https://example.com/project',
            'position' => 1,
            'is_visible' => true,
        ]);
    }

    private function createRelease(ArtistProfile $profile): Release
    {
        return $profile->releases()->create([
            'title' => 'Original Release',
            'release_type' => 'single',
            'description' => 'Original release description',
            'position' => 1,
            'is_visible' => true,
        ]);
    }

    public function test_artist_cannot_edit_another_artists_project(): void
    {
        [$attacker] = $this->createVerifiedArtist('project-edit-attacker');
        [, $ownerProfile] = $this->createVerifiedArtist('project-edit-owner');
        $project = $this->createProject($ownerProfile);

        $this->actingAs($attacker)
            ->get(route('projects.edit', $project->id))
            ->assertNotFound();
    }

    public function test_artist_cannot_update_another_artists_project(): void
    {
        [$attacker] = $this->createVerifiedArtist('project-update-attacker');
        [, $ownerProfile] = $this->createVerifiedArtist('project-update-owner');
        $project = $this->createProject($ownerProfile);

        $this->actingAs($attacker)
            ->put(route('projects.update', $project->id), [
                'title' => 'Hacked Project',
                'description' => 'Unauthorized change',
                'project_type' => 'Artwork',
                'url' => 'https://example.com/changed',
                'thumbnail_position_x' => 50,
                'thumbnail_position_y' => 50,
                'thumbnail_zoom' => 100,
                'thumbnail_offset_x' => 0,
                'thumbnail_offset_y' => 0,
            ])
            ->assertNotFound();

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'artist_profile_id' => $ownerProfile->id,
            'title' => 'Original Project',
            'description' => 'Original description',
            'is_visible' => true,
        ]);
    }

    public function test_artist_cannot_delete_another_artists_project(): void
    {
        [$attacker] = $this->createVerifiedArtist('project-delete-attacker');
        [, $ownerProfile] = $this->createVerifiedArtist('project-delete-owner');
        $project = $this->createProject($ownerProfile);

        $this->actingAs($attacker)
            ->delete(route('projects.destroy', $project->id))
            ->assertNotFound();

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'artist_profile_id' => $ownerProfile->id,
        ]);
    }

    public function test_artist_cannot_toggle_another_artists_project_visibility(): void
    {
        [$attacker] = $this->createVerifiedArtist('project-visibility-attacker');
        [, $ownerProfile] = $this->createVerifiedArtist('project-visibility-owner');
        $project = $this->createProject($ownerProfile);

        $this->actingAs($attacker)
            ->patch(route('projects.visibility', $project->id))
            ->assertNotFound();

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'artist_profile_id' => $ownerProfile->id,
            'is_visible' => true,
        ]);
    }

    public function test_artist_cannot_edit_another_artists_release(): void
    {
        [$attacker] = $this->createVerifiedArtist('release-edit-attacker');
        [, $ownerProfile] = $this->createVerifiedArtist('release-edit-owner');
        $release = $this->createRelease($ownerProfile);

        $this->actingAs($attacker)
            ->get(route('releases.edit', $release->id))
            ->assertNotFound();
    }

    public function test_artist_cannot_update_another_artists_release(): void
    {
        [$attacker] = $this->createVerifiedArtist('release-update-attacker');
        [, $ownerProfile] = $this->createVerifiedArtist('release-update-owner');
        $release = $this->createRelease($ownerProfile);

        $this->actingAs($attacker)
            ->put(route('releases.update', $release->id), [
                'title' => 'Hacked Release',
                'release_type' => 'single',
                'is_visible' => true,
            ])
            ->assertNotFound();

        $this->assertDatabaseHas('releases', [
            'id' => $release->id,
            'artist_profile_id' => $ownerProfile->id,
            'title' => 'Original Release',
            'description' => 'Original release description',
            'is_visible' => true,
        ]);
    }

    public function test_artist_cannot_delete_another_artists_release(): void
    {
        [$attacker] = $this->createVerifiedArtist('release-delete-attacker');
        [, $ownerProfile] = $this->createVerifiedArtist('release-delete-owner');
        $release = $this->createRelease($ownerProfile);

        $this->actingAs($attacker)
            ->delete(route('releases.destroy', $release->id))
            ->assertNotFound();

        $this->assertDatabaseHas('releases', [
            'id' => $release->id,
            'artist_profile_id' => $ownerProfile->id,
        ]);
    }

    public function test_artist_cannot_toggle_another_artists_release_visibility(): void
    {
        [$attacker] = $this->createVerifiedArtist('release-visibility-attacker');
        [, $ownerProfile] = $this->createVerifiedArtist('release-visibility-owner');
        $release = $this->createRelease($ownerProfile);

        $this->actingAs($attacker)
            ->patch(route('releases.visibility', $release->id))
            ->assertNotFound();

        $this->assertDatabaseHas('releases', [
            'id' => $release->id,
            'artist_profile_id' => $ownerProfile->id,
            'is_visible' => true,
        ]);
    }

    public function test_guest_cannot_access_projects_or_releases(): void
    {
        $this->get(route('projects.index'))->assertRedirect(route('login'));
        $this->get(route('releases.index'))->assertRedirect(route('login'));
    }

    public function test_user_with_unverified_email_cannot_access_projects_or_releases(): void
    {
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)
            ->get(route('projects.index'))
            ->assertRedirect(route('verification.notice'));

        $this->get(route('releases.index'))
            ->assertRedirect(route('verification.notice'));
    }

    public function test_pending_artist_cannot_access_projects_or_releases(): void
    {
        $user = User::factory()->create();

        ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'pending-artist',
            'display_name' => 'Pending Artist',
            'verification_status' => VerificationStatus::Pending,
        ]);

        $this->actingAs($user)
            ->get(route('projects.index'))
            ->assertRedirect(route('dashboard'));

        $this->get(route('releases.index'))
            ->assertRedirect(route('dashboard'));
    }

    public function test_rejected_artist_cannot_access_projects_or_releases(): void
    {
        $user = User::factory()->create();

        ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'rejected-artist',
            'display_name' => 'Rejected Artist',
            'verification_status' => VerificationStatus::Rejected,
        ]);

        $this->actingAs($user)
            ->get(route('projects.index'))
            ->assertRedirect(route('dashboard'));

        $this->get(route('releases.index'))
            ->assertRedirect(route('dashboard'));
    }
    public function test_project_creation_cannot_assign_another_artists_profile_id(): void
    {
        [$attacker, $attackerProfile] = $this->createVerifiedArtist('project-forgery-attacker');
        [, $victimProfile] = $this->createVerifiedArtist('project-forgery-victim');

        $this->actingAs($attacker)
            ->post(route('projects.store'), [
                'artist_profile_id' => $victimProfile->id,
                'title' => 'Forged Project',
                'description' => 'Testing ownership protection',
                'project_type' => 'Artwork',
                'url' => 'https://example.com/project',
                'thumbnail_position_x' => 50,
                'thumbnail_position_y' => 50,
                'thumbnail_zoom' => 100,
                'thumbnail_offset_x' => 0,
                'thumbnail_offset_y' => 0,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('projects', [
            'title' => 'Forged Project',
            'artist_profile_id' => $attackerProfile->id,
        ]);

        $this->assertDatabaseMissing('projects', [
            'title' => 'Forged Project',
            'artist_profile_id' => $victimProfile->id,
        ]);
    }

    public function test_release_creation_cannot_assign_another_artists_profile_id(): void
    {
        [$attacker, $attackerProfile] = $this->createVerifiedArtist('release-forgery-attacker');
        [, $victimProfile] = $this->createVerifiedArtist('release-forgery-victim');

        $this->actingAs($attacker)
            ->post(route('releases.store'), [
                'artist_profile_id' => $victimProfile->id,
                'title' => 'Forged Release',
                'release_type' => 'single',
                'description' => 'Testing ownership protection',
                'is_visible' => true,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('releases', [
            'title' => 'Forged Release',
            'artist_profile_id' => $attackerProfile->id,
        ]);

        $this->assertDatabaseMissing('releases', [
            'title' => 'Forged Release',
            'artist_profile_id' => $victimProfile->id,
        ]);
    }

    public function test_project_update_cannot_change_its_artist_profile_id(): void
    {
        [$owner, $ownerProfile] = $this->createVerifiedArtist('project-update-owner-profile');
        [, $victimProfile] = $this->createVerifiedArtist('project-update-victim-profile');

        $project = $this->createProject($ownerProfile);

        $this->actingAs($owner)
            ->put(route('projects.update', $project->id), [
                'artist_profile_id' => $victimProfile->id,
                'title' => 'Updated Project',
                'description' => 'Updated description',
                'project_type' => 'Artwork',
                'url' => 'https://example.com/updated',
                'thumbnail_position_x' => 50,
                'thumbnail_position_y' => 50,
                'thumbnail_zoom' => 100,
                'thumbnail_offset_x' => 0,
                'thumbnail_offset_y' => 0,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'artist_profile_id' => $ownerProfile->id,
            'title' => 'Updated Project',
        ]);
    }

    public function test_release_update_cannot_change_its_artist_profile_id(): void
    {
        [$owner, $ownerProfile] = $this->createVerifiedArtist('release-update-owner-profile');
        [, $victimProfile] = $this->createVerifiedArtist('release-update-victim-profile');

        $release = $this->createRelease($ownerProfile);

        $this->actingAs($owner)
            ->put(route('releases.update', $release->id), [
                'artist_profile_id' => $victimProfile->id,
                'title' => 'Updated Release',
                'release_type' => 'single',
                'is_visible' => true,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('releases', [
            'id' => $release->id,
            'artist_profile_id' => $ownerProfile->id,
            'title' => 'Updated Release',
        ]);
    }

}

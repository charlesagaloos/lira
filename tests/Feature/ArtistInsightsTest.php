<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\User;
use App\VerificationStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ArtistInsightsTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_views_are_recorded_once_per_visitor_session_and_not_for_the_owner(): void
    {
        $owner = User::factory()->create();
        $profile = ArtistProfile::create([
            'user_id' => $owner->id,
            'username' => 'insights-artist',
            'display_name' => 'Insights Artist',
            'verification_status' => VerificationStatus::Verified,
            'is_published' => true,
        ]);
        $project = $profile->projects()->create([
            'title' => 'Featured Project',
            'slug' => 'featured-project',
            'is_visible' => true,
        ]);

        $url = route('portfolio.project', [
            'username' => $profile->username,
            'slug' => $project->slug,
        ]);

        $this->get($url)->assertOk();
        $this->get($url)->assertOk();

        $this->assertDatabaseCount('project_views', 1);

        $this->actingAs($owner)
            ->get($url)
            ->assertOk();

        $this->assertDatabaseCount('project_views', 1);
    }

    public function test_dashboard_includes_daily_portfolio_views_and_recent_top_projects(): void
    {
        $user = User::factory()->create();
        $profile = ArtistProfile::create([
            'user_id' => $user->id,
            'username' => 'analytics-artist',
            'display_name' => 'Analytics Artist',
            'verification_status' => VerificationStatus::Verified,
            'is_published' => true,
        ]);

        $profile->portfolioViews()->create([
            'viewed_at' => now(),
        ]);
        $profile->portfolioViews()->create([
            'viewed_at' => now()->subDays(2),
        ]);
        $profile->portfolioViews()->create([
            'viewed_at' => now()->subDays(10),
        ]);

        $mostViewedProject = $profile->projects()->create([
            'title' => 'Most Viewed Project',
            'slug' => 'most-viewed-project',
        ]);
        $mostViewedProject->views()->create([
            'viewed_at' => now(),
        ]);
        $mostViewedProject->views()->create([
            'viewed_at' => now()->subDays(3),
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component('Dashboard')
                    ->where(
                        'analytics.daily_views',
                        fn($views) => count($views) === 60
                            && data_get(
                                collect($views)->firstWhere('date', now()->toDateString()),
                                'views',
                            ) === 1,
                    )
                    ->where('analytics.top_projects.0.title', 'Most Viewed Project')
                    ->where('analytics.top_projects.0.views', 2)
            );
    }
}

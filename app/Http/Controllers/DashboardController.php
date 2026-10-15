<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $profile = $user->artistProfile;

        $onboarding = null;
        $analytics = null;

        if ($profile) {
            $profile->loadCount([
                'portfolioViews',
                'projects',
                'releases',
            ]);

            $settings = $profile->portfolioSettings;

            $hasCompleteProfile = filled($profile->display_name)
                && filled($profile->username)
                && filled($profile->bio)
                && filled($profile->artist_type);

            $hasAvatar = filled($profile->avatar);

            $hasShowcasedWork = $profile->projects_count > 0
                || $profile->releases_count > 0;

            $hasCustomizedPortfolio = false;

            if ($settings) {
                $hasCustomizedPortfolio =
                    $settings->template !== 'default'
                    || filled($profile->cover_image);
            }

            $onboarding = [
                'profile_complete' => $hasCompleteProfile,
                'has_avatar' => $hasAvatar,
                'has_showcased_work' => $hasShowcasedWork,
                'portfolio_customized' => $hasCustomizedPortfolio,
                'portfolio_published' => (bool) $profile->is_published,
                'verification_status' => $profile->verification_status,
            ];

            $today = now()->startOfDay();
            $analyticsStart = $today->copy()->subDays(59);
            $viewCounts = $profile->portfolioViews()
                ->whereBetween('viewed_at', [
                    $analyticsStart,
                    $today->copy()->endOfDay(),
                ])
                ->selectRaw('DATE(viewed_at) as view_date, COUNT(*) as views')
                ->groupBy('view_date')
                ->pluck('views', 'view_date');

            $dailyViews = [];

            for ($day = $analyticsStart->copy(); $day->lte($today); $day->addDay()) {
                $date = $day->toDateString();

                $dailyViews[] = [
                    'date' => $date,
                    'views' => (int) $viewCounts->get($date, 0),
                ];
            }

            $topProjects = $profile->projects()
                ->whereHas('views', fn($query) => $query->whereBetween('viewed_at', [
                    $today->copy()->subDays(29),
                    $today->copy()->endOfDay(),
                ]))
                ->withCount([
                    'views as recent_views_count' => fn($query) => $query->whereBetween(
                        'viewed_at',
                        [
                            $today->copy()->subDays(29),
                            $today->copy()->endOfDay(),
                        ],
                    ),
                ])
                ->orderByDesc('recent_views_count')
                ->limit(3)
                ->get(['id', 'title'])
                ->map(fn($project) => [
                    'id' => $project->id,
                    'title' => $project->title,
                    'slug' => $project->slug,
                    'views' => $project->recent_views_count,
                ])
                ->values();

            $analytics = [
                'daily_views' => $dailyViews,
                'top_projects' => $topProjects,
            ];
        }

        return Inertia::render('Dashboard', [
            'profile' => $profile,
            'projects' => $profile
                ? $profile->projects()
                    ->limit(3)
                    ->get()
                : collect(),
            'projectCount' => $profile?->projects_count ?? 0,
            'onboarding' => $onboarding,
            'analytics' => $analytics,
        ]);
    }
}

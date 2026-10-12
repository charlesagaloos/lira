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
        ]);
    }
}

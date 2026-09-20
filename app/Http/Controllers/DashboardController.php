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

        if ($profile) {
            $profile->loadCount('portfolioViews');
        }

        return Inertia::render('Dashboard', [
            'profile' => $profile,
            'projects' => $profile
                ? $profile->projects()
                    ->limit(3)
                    ->get()
                : collect(),
        ]);
    }
}

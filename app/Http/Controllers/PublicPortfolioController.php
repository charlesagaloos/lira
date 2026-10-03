<?php

namespace App\Http\Controllers;

use App\Models\ArtistProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicPortfolioController extends Controller
{
    public function show(
        Request $request,
        string $username,
    ): Response {
        $profile = ArtistProfile::query()
            ->with([
                'portfolioSettings.navigationItems',
                'portfolioSettings.galleryImages',

                'projects' => fn($query) => $query
                    ->where('is_visible', true)
                    ->orderBy('position'),

                'releases' => fn($query) => $query
                    ->where('is_visible', true)
                    ->orderByDesc('release_date')
                    ->orderBy('position'),
            ])
            ->where('username', $username)
            ->where('is_published', true)
            ->firstOrFail();

        $isOwner = $request->user()?->id === $profile->user_id;

        if (!$isOwner) {
            $viewSessionKey = 'portfolio_viewed_' . $profile->id;

            if (!$request->session()->has($viewSessionKey)) {
                $profile->portfolioViews()->create([
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'viewed_at' => now(),
                ]);

                $request->session()->put(
                    $viewSessionKey,
                    true,
                );
            }
        }

        return Inertia::render('Public/Portfolio', [
            'profile' => $profile,
        ]);
    }
}

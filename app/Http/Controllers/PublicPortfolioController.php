<?php

namespace App\Http\Controllers;

use App\Models\ArtistProfile;
use Inertia\Inertia;
use Inertia\Response;

class PublicPortfolioController extends Controller
{
    public function show(string $username): Response
    {
        $profile = ArtistProfile::query()
            ->with([
                'projects' => fn ($query) => $query->where('is_visible', true),
            ])
            ->where('username', $username)
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('Public/Portfolio', [
            'profile' => $profile,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\ArtistProfile;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $artists = ArtistProfile::query()
            ->where('is_published', true)
            ->where('verification_status', 'verified')
            ->orderByDesc('created_at')
            ->limit(4)
            ->get([
                'id',
                'username',
                'display_name',
                'artist_type',
                'location',
                'avatar',
                'cover_image',
            ]);

        return Inertia::render('Home', [
            'artists' => $artists,
        ]);
    }
}

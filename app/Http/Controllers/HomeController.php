<?php

namespace App\Http\Controllers;

use App\Models\ArtistProfile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
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

    public function artists(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', 'string', 'max:100'],
        ]);

        $search = trim($filters['search'] ?? '');
        $type = $filters['type'] ?? 'all';

        $publicArtists = ArtistProfile::query()
            ->where('is_published', true)
            ->where('verification_status', 'verified');

        $artistTypes = (clone $publicArtists)
            ->whereNotNull('artist_type')
            ->where('artist_type', '<>', '')
            ->distinct()
            ->orderBy('artist_type')
            ->pluck('artist_type')
            ->values();

        $artists = (clone $publicArtists)
            ->when($type !== 'all', fn(Builder $query) => $query->where('artist_type', $type))
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $searchQuery) use ($search) {
                    $searchQuery
                        ->where('display_name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('artist_type', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->orderBy('display_name')
            ->paginate(12)
            ->withQueryString()
            ->through(fn(ArtistProfile $artist) => $artist->only([
                'id',
                'username',
                'display_name',
                'artist_type',
                'location',
                'avatar',
                'cover_image',
            ]));

        return Inertia::render('Artists/Index', [
            'artists' => $artists,
            'artistTypes' => $artistTypes,
            'filters' => [
                'search' => $search,
                'type' => $type,
            ],
        ]);
    }
}

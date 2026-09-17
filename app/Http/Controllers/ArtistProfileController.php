<?php

namespace App\Http\Controllers;

use App\VerificationStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtistProfileController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        if ($profile = $request->user()->artistProfile) {
            return redirect()->route('profile.edit');
        }

        return Inertia::render('Profile/Create');
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'profile' => $request->user()->artistProfile,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'username' => [
                'required',
                'string',
                'max:50',
                'alpha_dash',
                'unique:artist_profiles,username',
            ],
            'display_name' => [
                'required',
                'string',
                'max:255',
            ],
            'bio' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'artist_type' => [
                'nullable',
                'string',
                'max:100',
            ],
            'location' => [
                'nullable',
                'string',
                'max:255',
            ],
            'website' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'spotify_artist_url' => [
                'nullable',
                'url',
                'max:2048',
                'required_without:apple_music_artist_url',
                'regex:/^https?:\/\/open\.spotify\.com\/artist\/[A-Za-z0-9]+(?:\?.*)?$/',
            ],
            'apple_music_artist_url' => [
                'nullable',
                'url',
                'max:2048',
                'required_without:spotify_artist_url',
                'regex:/^https?:\/\/music\.apple\.com\/[a-z]{2}\/artist\/[^\/]+\/\d+(?:\?.*)?$/i',
            ],
        ]);

        $request->user()->artistProfile()->create([
            ...$validated,
            'verification_status' => VerificationStatus::Pending,
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Artist profile created successfully.');
    }

    public function update(Request $request): RedirectResponse
    {
        $profile = $request->user()->artistProfile;

        $validated = $request->validate([
            'username' => [
                'required',
                'string',
                'max:50',
                'alpha_dash',
                'unique:artist_profiles,username,' . $profile->id,
            ],
            'display_name' => [
                'required',
                'string',
                'max:255',
            ],
            'bio' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'artist_type' => [
                'nullable',
                'string',
                'max:100',
            ],
            'location' => [
                'nullable',
                'string',
                'max:255',
            ],
            'website' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'spotify_artist_url' => [
                'nullable',
                'url',
                'max:2048',
                'required_without:apple_music_artist_url',
                'regex:/^https?:\/\/open\.spotify\.com\/artist\/[A-Za-z0-9]+(?:\?.*)?$/',
            ],
            'apple_music_artist_url' => [
                'nullable',
                'url',
                'max:2048',
                'required_without:spotify_artist_url',
                'regex:/^https?:\/\/music\.apple\.com\/[a-z]{2}\/artist\/[^\/]+\/\d+(?:\?.*)?$/i',
            ],
        ]);

        $profile->update($validated);

        return redirect()
            ->route('profile.edit')
            ->with('success', 'Artist profile updated successfully.');
    }
}

<?php

namespace App\Http\Controllers;

use App\VerificationStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
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

    public function show(Request $request): Response
    {
        return Inertia::render('Profile/View', [
            'profile' => $request->user()
                ->artistProfile()
                ->with('socialLinks')
                ->firstOrFail(),
        ]);
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'profile' => $request->user()
                ->artistProfile()
                ->with('socialLinks')
                ->firstOrFail(),
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
            'social_links' => [
                'nullable',
                'array',
                'max:8',
            ],
            'social_links.*.platform' => [
                'required',
                'string',
                'distinct',
                'in:spotify,apple_music,instagram,youtube,tiktok,x,facebook,soundcloud',
            ],
            'social_links.*.url' => [
                'required',
                'url',
                'max:2048',
            ],
        ]);

        $socialLinks = $validated['social_links'] ?? [];

        unset($validated['social_links']);

        DB::transaction(function () use ($request, $validated, $socialLinks, &$profile) {
            $profile = $request->user()->artistProfile()->create([
                ...$validated,
                'verification_status' => VerificationStatus::Pending,
            ]);

            foreach ($socialLinks as $position => $socialLink) {
                $profile->socialLinks()->create([
                    'platform' => $socialLink['platform'],
                    'url' => $socialLink['url'],
                    'position' => $position,
                ]);
            }

            $profile->portfolioSettings()->create();
        });

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
            'social_links' => [
                'nullable',
                'array',
                'max:8',
            ],
            'social_links.*.platform' => [
                'required',
                'string',
                'distinct',
                'in:spotify,apple_music,instagram,youtube,tiktok,x,facebook,soundcloud',
            ],
            'social_links.*.url' => [
                'required',
                'url',
                'max:2048',
            ],
        ]);

        $socialLinks = $validated['social_links'] ?? [];

        unset($validated['social_links']);

        DB::transaction(function () use ($profile, $validated, $socialLinks) {
            $profile->update($validated);

            $profile->socialLinks()->delete();

            foreach ($socialLinks as $position => $socialLink) {
                $profile->socialLinks()->create([
                    'platform' => $socialLink['platform'],
                    'url' => $socialLink['url'],
                    'position' => $position,
                    'is_visible' => true,
                ]);
            }
        });

        return redirect()
            ->route('profile.edit')
            ->with('success', 'Artist profile updated successfully.');
    }
}

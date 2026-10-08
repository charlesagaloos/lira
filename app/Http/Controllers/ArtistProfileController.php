<?php

namespace App\Http\Controllers;

use App\Services\ImageModerationService;
use App\VerificationStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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

    public function store(
        Request $request,
        ImageModerationService $imageModerationService,
    ): RedirectResponse {
        $validated = $request->validate([
            'avatar' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
            'avatar_zoom' => [
                'nullable',
                'numeric',
                'min:1',
                'max:3',
            ],
            'avatar_position_x' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],
            'avatar_position_y' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],
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
            'about_me' => [
                'nullable',
                'string',
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

        if ($request->hasFile('avatar')) {
            $moderation = $imageModerationService->check(
                $request->file('avatar'),
            );

            if (!$moderation['allowed']) {
                return back()
                    ->withErrors([
                        'avatar' => $moderation['message'],
                    ])
                    ->withInput();
            }

            $validated['avatar'] = $request
                ->file('avatar')
                ->store('artist-avatars', 'public');
        }

        $validated['avatar_zoom'] = $validated['avatar_zoom'] ?? 1;
        $validated['avatar_position_x'] = $validated['avatar_position_x'] ?? 50;
        $validated['avatar_position_y'] = $validated['avatar_position_y'] ?? 50;

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

    public function update(
        Request $request,
        ImageModerationService $imageModerationService,
    ): RedirectResponse {
        $profile = $request->user()->artistProfile;

        $validated = $request->validate([
            'avatar' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
            'avatar_zoom' => [
                'nullable',
                'numeric',
                'min:1',
                'max:3',
            ],
            'avatar_position_x' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],
            'avatar_position_y' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
            ],
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
            'about_me' => [
                'nullable',
                'string',
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

        if ($request->hasFile('avatar')) {
            $moderation = $imageModerationService->check(
                $request->file('avatar'),
            );

            if (!$moderation['allowed']) {
                return back()
                    ->withErrors([
                        'avatar' => $moderation['message'],
                    ])
                    ->withInput();
            }

            $oldAvatar = $profile->avatar;

            $validated['avatar'] = $request
                ->file('avatar')
                ->store('artist-avatars', 'public');

            if ($oldAvatar) {
                Storage::disk('public')->delete($oldAvatar);
            }
        } else {
            unset($validated['avatar']);
        }

        $validated['avatar_zoom'] = $validated['avatar_zoom'] ?? $profile->avatar_zoom ?? 1;
        $validated['avatar_position_x'] = $validated['avatar_position_x'] ?? $profile->avatar_position_x ?? 50;
        $validated['avatar_position_y'] = $validated['avatar_position_y'] ?? $profile->avatar_position_y ?? 50;

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

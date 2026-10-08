<?php

namespace App\Http\Controllers;

use App\Models\Release;
use App\Services\ImageModerationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ReleaseController extends Controller
{
    public function index(Request $request): Response
    {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        $releases = $profile->releases()
            ->orderBy('position')
            ->orderByDesc('release_date')
            ->get();

        return Inertia::render('Releases/Index', [
            'profile' => $profile->only([
                'id',
                'username',
                'avatar',
                'avatar_zoom',
                'avatar_position_x',
                'avatar_position_y',
                'display_name',
                'verification_status',
                'is_published',
            ]),
            'releases' => $releases,
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()->artistProfile, 404);

        return Inertia::render('Releases/Create');
    }

    public function store(
        Request $request,
        ImageModerationService $imageModerationService,
    ): RedirectResponse {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'release_type' => [
                'required',
                'string',
                'in:single,ep,album,mixtape,compilation',
            ],
            'artwork' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'dimensions:min_width=500,min_height=500',
                'max:5120',
            ],
            'release_date' => [
                'nullable',
                'date',
            ],
            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'spotify_url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'apple_music_url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'youtube_url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'soundcloud_url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'bandcamp_url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'lyrics' => [
                'nullable',
                'string',
            ],
            'is_visible' => [
                'required',
                'boolean',
            ],
        ]);

        if ($request->hasFile('artwork')) {
            $moderation = $imageModerationService->check(
                $request->file('artwork'),
            );

            if (!$moderation['allowed']) {
                return back()
                    ->withErrors([
                        'artwork' => $moderation['message'],
                    ])
                    ->withInput();
            }

            $validated['artwork'] = $request
                ->file('artwork')
                ->store('release-artwork', 'public');
        }

        $validated['position'] =
            ($profile->releases()->max('position') ?? 0) + 1;

        $profile->releases()->create($validated);

        return redirect()
            ->route('releases.index')
            ->with('success', 'Release added successfully.');
    }

    public function edit(Request $request, Release $release): Response
    {
        $this->ensureOwnership($request, $release);

        return Inertia::render('Releases/Edit', [
            'release' => $release,
        ]);
    }

    public function update(
        Request $request,
        Release $release,
        ImageModerationService $imageModerationService,
    ): RedirectResponse {
        $this->ensureOwnership($request, $release);

        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'release_type' => [
                'required',
                'string',
                'in:single,ep,album,mixtape,compilation',
            ],
            'artwork' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'dimensions:min_width=500,min_height=500',
                'max:5120',
            ],
            'release_date' => [
                'nullable',
                'date',
            ],
            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'spotify_url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'apple_music_url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'youtube_url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'soundcloud_url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'bandcamp_url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'lyrics' => [
                'nullable',
                'string',
            ],
            'is_visible' => [
                'required',
                'boolean',
            ],
        ]);

        if ($request->hasFile('artwork')) {
            $moderation = $imageModerationService->check(
                $request->file('artwork'),
            );

            if (!$moderation['allowed']) {
                return back()
                    ->withErrors([
                        'artwork' => $moderation['message'],
                    ])
                    ->withInput();
            }

            $oldArtwork = $release->artwork;

            $validated['artwork'] = $request
                ->file('artwork')
                ->store('release-artwork', 'public');

            if ($oldArtwork) {
                Storage::disk('public')->delete($oldArtwork);
            }
        } else {
            unset($validated['artwork']);
        }

        $release->update($validated);

        return redirect()
            ->route('releases.index')
            ->with('success', 'Release updated successfully.');
    }

    public function destroy(Request $request, Release $release): RedirectResponse
    {
        $this->ensureOwnership($request, $release);

        if ($release->artwork) {
            Storage::disk('public')->delete($release->artwork);
        }

        $release->delete();

        return redirect()
            ->route('releases.index')
            ->with('success', 'Release deleted successfully.');
    }

    public function toggleVisibility(Request $request, Release $release): RedirectResponse
    {
        $this->ensureOwnership($request, $release);

        $release->update([
            'is_visible' => !$release->is_visible,
        ]);

        return redirect()
            ->route('releases.index')
            ->with('success', 'Release visibility updated.');
    }

    private function ensureOwnership(Request $request, Release $release): void
    {
        abort_unless(
            $release->artist_profile_id ===
            $request->user()->artistProfile?->id,
            403
        );
    }
}

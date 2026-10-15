<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ArtistSettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        $profile = $request->user()->artistProfile;

        return Inertia::render('Settings/ArtistSettings', [
            'dashboardTheme' => $request->user()->dashboard_theme,
            'profile' => $profile?->only([
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
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'dashboard_theme' => [
                'required',
                'string',
                Rule::in(['dark', 'light']),
            ],
        ]);

        $request->user()->update($validated);

        return back()->with('success', 'Dashboard appearance saved.');
    }
}

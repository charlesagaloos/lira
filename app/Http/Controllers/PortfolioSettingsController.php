<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioSettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        return Inertia::render('Portfolio/Settings', [
            'settings' => $profile->portfolioSettings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        $validated = $request->validate([
            'template' => [
                'required',
                'string',
                'in:default',
            ],
            'primary_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'background_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'text_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'accent_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'card_background_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'card_text_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'card_accent_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
        ]);

        $settings = $profile->portfolioSettings;

        abort_unless($settings, 404);

        $settings->update($validated);

        return redirect()
            ->route('portfolio.settings.edit')
            ->with('success', 'Portfolio settings updated successfully.');
    }
}

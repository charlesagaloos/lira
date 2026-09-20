<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioSettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        $profile = $request->user()
            ->artistProfile()
            ->with([
                'portfolioSettings',
                'projects' => fn($query) => $query
                    ->where('is_visible', true)
                    ->orderBy('position'),
            ])
            ->firstOrFail();

        $settings = $profile->portfolioSettings;

        abort_unless($settings, 404);

        /*
        |--------------------------------------------------------------------------
        | Cover Image
        |--------------------------------------------------------------------------
        |
        | The actual cover image is stored on artist_profiles.
        | Expose it through the settings prop so the frontend can
        | consistently use settings.cover_image.
        |
        */

        $settings->setAttribute(
            'cover_image',
            $profile->cover_image,
        );

        return Inertia::render('Portfolio/Settings', [
            'settings' => $settings,
            'profile' => $profile,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

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

            /*
            |--------------------------------------------------------------------------
            | Cover Image
            |--------------------------------------------------------------------------
            */

            'cover_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,gif',
                'dimensions:min_width=2660,min_height=1140',
                'max:5120',
            ],

            'remove_cover_image' => [
                'nullable',
                'boolean',
            ],

            /*
            |--------------------------------------------------------------------------
            | Cover Image Position
            |--------------------------------------------------------------------------
            */

            'cover_image_position_x' => [
                'required',
                'numeric',
                'between:0,100',
            ],

            'cover_image_position_y' => [
                'required',
                'numeric',
                'between:0,100',
            ],

            'cover_image_zoom' => [
                'required',
                'numeric',
                'between:1,2',
            ],

            'cover_image_offset_x' => [
                'required',
                'numeric',
                'between:-50,50',
            ],

            'cover_image_offset_y' => [
                'required',
                'numeric',
                'between:-50,50',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Cover Image
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('cover_image')) {
            $oldCoverImage = $profile->cover_image;

            $newCoverImage = $request
                ->file('cover_image')
                ->store('artist-covers', 'public');

            $profile->cover_image = $newCoverImage;
            $profile->save();

            /*
            | Delete the previous image after the new one has been saved.
            */

            if ($oldCoverImage) {
                Storage::disk('public')->delete(
                    $oldCoverImage,
                );
            }
        } elseif ($request->boolean('remove_cover_image')) {
            /*
            | Remove the existing cover image only when
            | no replacement image was uploaded.
            */

            if ($profile->cover_image) {
                Storage::disk('public')->delete(
                    $profile->cover_image,
                );
            }

            $profile->cover_image = null;
            $profile->save();
        }

        /*
        |--------------------------------------------------------------------------
        | Portfolio Settings
        |--------------------------------------------------------------------------
        */

        $settings = $profile->portfolioSettings;

        abort_unless($settings, 404);

        /*
        | cover_image is stored on artist_profiles, not portfolio_settings.
        | remove_cover_image is only a request flag.
        |
        | Remove both before updating portfolio_settings.
        */

        unset(
            $validated['cover_image'],
            $validated['remove_cover_image'],
        );

        $settings->update($validated);

        /*
        |--------------------------------------------------------------------------
        | Redirect
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route('portfolio.settings.edit')
            ->with(
                'success',
                'Portfolio settings updated successfully.',
            );
    }
}

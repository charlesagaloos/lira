<?php

namespace App\Http\Controllers;

use App\Services\ImageModerationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class PortfolioSettingsController extends Controller
{
    public function edit(Request $request): Response
    {
        $profile = $request->user()
            ->artistProfile()
            ->with([
                'portfolioSettings.navigationItems',
                'portfolioSettings.galleryImages',
                'projects' => fn($query) => $query
                    ->where('is_visible', true)
                    ->orderBy('position'),
                'releases' => fn($query) => $query
                    ->where('is_visible', true)
                    ->orderBy('position'),
            ])
            ->firstOrFail();

        $settings = $profile->portfolioSettings;

        abort_unless($settings, 404);

        $settings->setAttribute(
            'cover_image',
            $profile->cover_image,
        );

        return Inertia::render('Portfolio/Settings', [
            'settings' => $settings,
            'profile' => $profile,
            'navigationItems' => $settings->navigationItems,
            'galleryImages' => $settings->galleryImages,
        ]);
    }

    public function update(
        Request $request,
        ImageModerationService $imageModerationService,
    ): RedirectResponse {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        /* Validate Input */

        $validated = $request->validate([
            'template' => [
                'required',
                'string',
                Rule::in([
                    'default',
                    'editorial',
                    'canvas',
                    'motion',
                    'musician',
                ]),
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
            'hover_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'surface_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'muted_text_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'border_color' => [
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
            'card_primary_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'card_hover_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],

            /* Cover Image */

            'cover_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,gif',
                'max:5120',
            ],
            'remove_cover_image' => [
                'nullable',
                'boolean',
            ],
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

            /* Hero */

            'show_hero' => ['required', 'boolean'],
            'hero_label' => ['nullable', 'string', 'max:100'],
            'hero_statement' => ['nullable', 'string', 'max:500'],

            /* Work */

            'show_work' => ['required', 'boolean'],
            'work_label' => ['nullable', 'string', 'max:100'],
            'work_description' => ['nullable', 'string', 'max:500'],

            /* About */

            'show_about' => ['required', 'boolean'],
            'about_label' => ['nullable', 'string', 'max:100'],

            /* Artist Message */

            'show_artist_message' => ['required', 'boolean'],
            'artist_message_label' => [
                'nullable',
                'string',
                'max:100',
            ],
            'artist_message' => [
                'nullable',
                'string',
                'max:2000',
            ],
            'canvas_background_text' => [
                'nullable',
                'string',
                'max:500',
            ],

            /* Gallery */

            'show_gallery' => ['required', 'boolean'],
            'gallery_label' => ['nullable', 'string', 'max:100'],
            'gallery_description' => [
                'nullable',
                'string',
                'max:500',
            ],
            'gallery_display' => [
                'required',
                'string',
                'in:grid,masonry,editorial,freeform',
            ],
            'gallery_columns' => [
                'required',
                'integer',
                'between:2,5',
            ],
            'gallery_image_aspect' => [
                'required',
                'string',
                'in:original,square,portrait,landscape',
            ],
            'gallery_show_captions' => ['required', 'boolean'],
            'gallery_show_titles' => ['required', 'boolean'],
            'gallery_enable_lightbox' => ['required', 'boolean'],

            /* Responsive Gallery */

            'gallery_responsive' => ['required', 'array'],

            'gallery_responsive.desktop' => ['required', 'array'],
            'gallery_responsive.desktop.display' => [
                'required',
                'string',
                'in:grid,masonry,editorial,freeform',
            ],
            'gallery_responsive.desktop.columns' => [
                'required',
                'integer',
                'between:2,5',
            ],
            'gallery_responsive.desktop.image_aspect' => [
                'required',
                'string',
                'in:original,square,portrait,landscape',
            ],

            'gallery_responsive.tablet' => ['required', 'array'],
            'gallery_responsive.tablet.display' => [
                'required',
                'string',
                'in:grid,masonry,editorial,freeform',
            ],
            'gallery_responsive.tablet.columns' => [
                'required',
                'integer',
                'between:2,4',
            ],
            'gallery_responsive.tablet.image_aspect' => [
                'required',
                'string',
                'in:original,square,portrait,landscape',
            ],

            'gallery_responsive.mobile' => ['required', 'array'],
            'gallery_responsive.mobile.display' => [
                'required',
                'string',
                'in:grid,masonry,editorial,freeform',
            ],
            'gallery_responsive.mobile.columns' => [
                'required',
                'integer',
                'between:1,2',
            ],
            'gallery_responsive.mobile.image_aspect' => [
                'required',
                'string',
                'in:original,square,portrait,landscape',
            ],

            /* Music */

            'music_label' => ['nullable', 'string', 'max:100'],

            /* Navigation */

            'show_navigation' => ['required', 'boolean'],
            'navigation_items' => ['nullable', 'array'],
            'navigation_items.*.id' => ['nullable', 'integer'],
            'navigation_items.*.label' => [
                'required',
                'string',
                'max:100',
            ],
            'navigation_items.*.destination' => [
                'required',
                'string',
                Rule::in([
                    'home',
                    'work',
                    'gallery',
                    'music',
                    'about',
                    'artist_message',
                    'contact',
                    'footer',
                    'external',
                ]),
            ],
            'navigation_items.*.url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'navigation_items.*.sort_order' => [
                'required',
                'integer',
                'min:0',
            ],
            'navigation_items.*.is_visible' => [
                'required',
                'boolean',
            ],

            /* Gallery Ordering */

            'gallery_order' => ['nullable', 'array'],
            'gallery_order.*.id' => [
                'required',
                'integer',
                'distinct',
            ],
            'gallery_order.*.sort_order' => [
                'required',
                'integer',
                'min:0',
            ],

            /* Footer */

            'show_footer' => ['required', 'boolean'],
            'footer_label' => ['nullable', 'string', 'max:100'],
            'footer_message' => ['nullable', 'string', 'max:500'],
            'show_footer_socials' => ['required', 'boolean'],

            'footer_logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
            'remove_footer_logo' => ['nullable', 'boolean'],

            'copyright_text' => [
                'nullable',
                'string',
                'max:255',
            ],
            'show_powered_by_lira' => ['required', 'boolean'],

            /* Music Display */

            'show_music' => ['required', 'boolean'],
            'music_release_display' => [
                'required',
                'string',
                'in:latest,all',
            ],
            'music_release_limit' => [
                'required',
                'integer',
                'between:1,24',
            ],
            'featured_release_id' => [
                'nullable',
                'integer',
                Rule::exists('releases', 'id')
                    ->where(
                        fn($query) => $query
                            ->where('artist_profile_id', $profile->id)
                            ->where('is_visible', true),
                    ),
            ],
            'show_music_links' => ['required', 'boolean'],
        ]);

        $settings = $profile->portfolioSettings;

        abort_unless($settings, 404);

        /*
        |--------------------------------------------------------------------------
        | Prepare Input
        |--------------------------------------------------------------------------
        */

        $hasNavigationItems = array_key_exists('navigation_items', $validated);
        $navigationItems = $validated['navigation_items'] ?? [];

        $hasGalleryOrder = isset($validated['gallery_order'])
            && is_array($validated['gallery_order']);

        $galleryOrder = $hasGalleryOrder
            ? $validated['gallery_order']
            : [];

        $removeCoverImage = $request->boolean('remove_cover_image');
        $removeFooterLogo = $request->boolean('remove_footer_logo');

        /* Validate Navigation URLs */

        foreach ($navigationItems as $index => $item) {
            $destination = $item['destination'];
            $url = $item['url'] ?? null;

            if ($destination === 'external') {
                $parts = is_string($url) && $url !== ''
                    ? parse_url($url)
                    : false;

                $scheme = is_array($parts)
                    ? strtolower($parts['scheme'] ?? '')
                    : '';

                if (
                    !$url ||
                    !is_array($parts) ||
                    !in_array($scheme, ['http', 'https'], true) ||
                    empty($parts['host'])
                ) {
                    return back()
                        ->withErrors([
                            "navigation_items.{$index}.url" =>
                                'External navigation items require a valid HTTP or HTTPS URL.',
                        ])
                        ->withInput();
                }
            } elseif ($url !== null && $url !== '') {
                return back()
                    ->withErrors([
                        "navigation_items.{$index}.url" =>
                            'Only external navigation items may have a URL.',
                    ])
                    ->withInput();
            }
        }

        /* Pre-validate Ownership Before File Storage */

        $existingNavigationItems = $settings
            ->navigationItems()
            ->get()
            ->keyBy('id');

        foreach ($navigationItems as $item) {
            $navigationItemId = $item['id'] ?? null;

            if (
                $navigationItemId !== null &&
                !$existingNavigationItems->has($navigationItemId)
            ) {
                abort(404);
            }
        }

        $existingGalleryImages = $settings
            ->galleryImages()
            ->get()
            ->keyBy('id');

        if ($hasGalleryOrder) {
            $submittedIds = collect($galleryOrder)
                ->pluck('id')
                ->values();

            abort_unless(
                $submittedIds->count() === $existingGalleryImages->count(),
                422,
            );

            abort_unless(
                $submittedIds->every(
                    fn($id) => $existingGalleryImages->has($id),
                ),
                422,
            );
        }

        /* Moderate Both Images Before Storing Either */

        if ($request->hasFile('cover_image')) {
            $moderation = $imageModerationService->check(
                $request->file('cover_image'),
            );

            if (!$moderation['allowed']) {
                return back()
                    ->withErrors([
                        'cover_image' => $moderation['message'],
                    ])
                    ->withInput();
            }
        }

        if ($request->hasFile('footer_logo')) {
            $moderation = $imageModerationService->check(
                $request->file('footer_logo'),
            );

            if (!$moderation['allowed']) {
                return back()
                    ->withErrors([
                        'footer_logo' => $moderation['message'],
                    ])
                    ->withInput();
            }
        }

        /* Prepare Settings Data */

        $oldCoverImage = $profile->cover_image;
        $oldFooterLogo = $settings->footer_logo;

        unset(
            $validated['cover_image'],
            $validated['remove_cover_image'],
            $validated['footer_logo'],
            $validated['remove_footer_logo'],
            $validated['navigation_items'],
            $validated['gallery_order'],
        );

        $newCoverImage = null;
        $newFooterLogo = null;

        /* Store Files and Update Database Transactionally */

        try {
            if ($request->hasFile('cover_image')) {
                $newCoverImage = $request->file('cover_image')
                    ->store('portfolio/covers', 'public');

                if (!$newCoverImage) {
                    throw new RuntimeException(
                        'The cover image could not be stored.',
                    );
                }
            }

            if ($request->hasFile('footer_logo')) {
                $newFooterLogo = $request->file('footer_logo')
                    ->store('portfolio/footer-logos', 'public');

                if (!$newFooterLogo) {
                    throw new RuntimeException(
                        'The footer logo could not be stored.',
                    );
                }
            }

            DB::transaction(function () use ($profile, $settings, $validated, $navigationItems, $hasNavigationItems, $galleryOrder, $hasGalleryOrder, $newCoverImage, $newFooterLogo, $removeCoverImage, $removeFooterLogo, ): void {
                /*
                 * Re-check ownership inside the transaction before
                 * performing any database writes.
                 */

                $currentNavigationItems = $settings
                    ->navigationItems()
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                foreach ($navigationItems as $item) {
                    $navigationItemId = $item['id'] ?? null;

                    if (
                        $navigationItemId !== null &&
                        !$currentNavigationItems->has($navigationItemId)
                    ) {
                        abort(404);
                    }
                }

                $currentGalleryImages = $settings
                    ->galleryImages()
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                if ($hasGalleryOrder) {
                    $submittedIds = collect($galleryOrder)
                        ->pluck('id')
                        ->values();

                    abort_unless(
                        $submittedIds->count()
                        === $currentGalleryImages->count(),
                        422,
                    );

                    abort_unless(
                        $submittedIds->every(
                            fn($id) => $currentGalleryImages->has($id),
                        ),
                        422,
                    );
                }

                /*
                 * Apply image changes.
                 * A newly uploaded image takes precedence over removal.
                 */

                if ($newCoverImage !== null) {
                    $profile->cover_image = $newCoverImage;
                } elseif ($removeCoverImage) {
                    $profile->cover_image = null;
                }

                if ($newFooterLogo !== null) {
                    $settings->footer_logo = $newFooterLogo;
                } elseif ($removeFooterLogo) {
                    $settings->footer_logo = null;
                }

                /*
                 * Save profile and settings.
                 */

                $settings->fill($validated);

                $profile->save();
                $settings->save();

                /*
                 * Update or create navigation items.
                 */

                if ($hasNavigationItems) {

                    $submittedNavigationItemIds = [];

                    foreach ($navigationItems as $item) {
                        $navigationItemId = $item['id'] ?? null;

                        if ($navigationItemId !== null) {
                            $navigationItem = $currentNavigationItems->get(
                                $navigationItemId,
                            );

                            abort_unless($navigationItem, 404);
                        } else {
                            $navigationItem = $settings
                                ->navigationItems()
                                ->make();
                        }

                        $navigationItem->fill([
                            'label' => $item['label'],
                            'destination' => $item['destination'],
                            'url' => $item['url'] ?? null,
                            'sort_order' => $item['sort_order'],
                            'is_visible' => $item['is_visible'],
                        ]);

                        $settings->navigationItems()->save($navigationItem);

                        $submittedNavigationItemIds[] = $navigationItem->id;
                    }

                    /*
                     * Delete navigation items omitted from the submission.
                     */

                    $settings
                        ->navigationItems()
                        ->when(
                            !empty($submittedNavigationItemIds),
                            fn($query) => $query->whereNotIn(
                                'id',
                                $submittedNavigationItemIds,
                            ),
                        )
                        ->when(
                            empty($submittedNavigationItemIds),
                            fn($query) => $query,
                        )
                        ->delete();
                }

                /*
                 * Apply gallery order after ownership validation.
                 */

                if ($hasGalleryOrder) {
                    foreach ($galleryOrder as $item) {
                        $image = $currentGalleryImages->get($item['id']);

                        abort_unless($image, 422);

                        $image->update([
                            'sort_order' => $item['sort_order'],
                        ]);
                    }
                }
            });
        } catch (Throwable $exception) {
            /*
             * The database transaction has failed or rolled back.
             * Remove newly stored files without masking the original
             * exception if file cleanup itself fails.
             */

            foreach ([$newCoverImage, $newFooterLogo] as $newFile) {
                if (!$newFile) {
                    continue;
                }

                try {
                    Storage::disk('public')->delete($newFile);
                } catch (Throwable $cleanupException) {
                    report($cleanupException);
                }
            }

            throw $exception;
        }

        /* Delete Old Images After Successful Database Commit */

        $currentCoverImage = $profile->cover_image;
        $currentFooterLogo = $settings->footer_logo;

        if (
            $oldCoverImage &&
            $oldCoverImage !== $currentCoverImage
        ) {
            try {
                Storage::disk('public')->delete($oldCoverImage);
            } catch (Throwable $exception) {
                report($exception);
            }
        }

        if (
            $oldFooterLogo &&
            $oldFooterLogo !== $currentFooterLogo
        ) {
            try {
                Storage::disk('public')->delete($oldFooterLogo);
            } catch (Throwable $exception) {
                report($exception);
            }
        }

        return redirect()
            ->route('portfolio.settings.edit')
            ->with(
                'success',
                'Portfolio settings updated successfully.',
            );
    }
}

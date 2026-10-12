<?php

namespace App\Http\Controllers;

use App\Models\PortfolioGalleryImage;
use App\Services\ImageModerationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        $profile = auth()->user()->artistProfile;

        abort_unless($profile, 404);

        $settings = $profile->portfolioSettings;

        abort_unless($settings, 404);

        $galleryImages = $settings
            ->galleryImages()
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Gallery/index', [
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
            'galleryImages' => $galleryImages,
        ]);
    }

    public function create()
    {
        $profile = auth()->user()->artistProfile;

        abort_unless($profile, 404);

        $settings = $profile->portfolioSettings;

        abort_unless($settings, 404);

        return Inertia::render('Gallery/Create', [
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
        ]);
    }

    public function store(Request $request, ImageModerationService $imageModerationService)
    {
        $profile = auth()->user()->artistProfile;

        abort_unless($profile, 404);

        $settings = $profile->portfolioSettings;

        abort_unless($settings, 404);

        $validated = $request->validate([
            'image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp,gif',
                'max:10240',
            ],
            'title' => [
                'nullable',
                'string',
                'max:255',
            ],
            'caption' => [
                'nullable',
                'string',
                'max:500',
            ],
            'alt_text' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $moderation = $imageModerationService->check(
            $validated['image'],
        );

        if (!$moderation['allowed']) {
            return back()
                ->withErrors([
                    'image' => $moderation['message'],
                ])
                ->withInput();
        }


        $imagePath = $validated['image']->store(
            'artist-gallery',
            'public',
        );

        if (!$imagePath) {
            return back()
                ->withErrors([
                    'image' => 'Unable to store the uploaded image. Please try again.',
                ])
                ->withInput();
        }

        try {
            $nextSortOrder = $settings
                ->galleryImages()
                ->max('sort_order');

            $settings->galleryImages()->create([
                'image' => $imagePath,
                'title' => $validated['title'] ?? null,
                'caption' => $validated['caption'] ?? null,
                'alt_text' => $validated['alt_text'] ?? null,
                'sort_order' => is_null($nextSortOrder)
                    ? 0
                    : $nextSortOrder + 1,
            ]);
        } catch (\Throwable $exception) {
            try {
                Storage::disk('public')->delete($imagePath);
            } catch (\Throwable $cleanupException) {
                report($cleanupException);
            }

            throw $exception;
        }

        return redirect()
            ->route('gallery.index')
            ->with(
                'success',
                'Gallery image added successfully.',
            );
    }

    public function edit(PortfolioGalleryImage $galleryImage)
    {
        $profile = auth()->user()->artistProfile;

        abort_unless($profile, 404);

        $settings = $profile->portfolioSettings;

        abort_unless($settings, 404);

        $this->authorizeGalleryImage($galleryImage);

        return Inertia::render('Gallery/Edit', [
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
            'galleryImage' => $galleryImage,
        ]);
    }


    public function update(
        Request $request,
        PortfolioGalleryImage $galleryImage,
        ImageModerationService $imageModerationService,
    ) {
        $this->authorizeGalleryImage($galleryImage);

        $validated = $request->validate([
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp,gif',
                'max:10240',
            ],
            'title' => [
                'nullable',
                'string',
                'max:255',
            ],
            'caption' => [
                'nullable',
                'string',
                'max:500',
            ],
            'alt_text' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $oldImage = null;
        $newImage = null;

        if (!empty($validated['image'])) {
            $moderation = $imageModerationService->check(
                $validated['image'],
            );

            if (!$moderation['allowed']) {
                return back()
                    ->withErrors([
                        'image' => $moderation['message'],
                    ])
                    ->withInput();
            }

            $oldImage = $galleryImage->image;

            $newImage = $validated['image']->store(
                'artist-gallery',
                'public',
            );

            if (!$newImage) {
                return back()
                    ->withErrors([
                        'image' => 'Unable to store the replacement image. Your existing image has been preserved.',
                    ])
                    ->withInput();
            }

            $galleryImage->image = $newImage;

        }

        unset($validated['image']);

        $galleryImage->fill([
            'title' => $validated['title'] ?? null,
            'caption' => $validated['caption'] ?? null,
            'alt_text' => $validated['alt_text'] ?? null,
        ]);

        try {
            $galleryImage->save();
        } catch (\Throwable $exception) {
            if ($newImage) {
                try {
                    Storage::disk('public')->delete($newImage);
                } catch (\Throwable $cleanupException) {
                    report($cleanupException);
                }
            }

            throw $exception;
        }

        if (
            $oldImage &&
            $oldImage !== $galleryImage->image
        ) {
            Storage::disk('public')->delete($oldImage);
        }

        return redirect()
            ->route('gallery.index')
            ->with(
                'success',
                'Gallery image updated successfully.',
            );
    }

    public function destroy(
        PortfolioGalleryImage $galleryImage,
    ) {
        $this->authorizeGalleryImage($galleryImage);

        $image = $galleryImage->image;

        $galleryImage->delete();

        if ($image) {
            Storage::disk('public')->delete($image);
        }

        return redirect()
            ->route('gallery.index')
            ->with(
                'success',
                'Gallery image deleted successfully.',
            );
    }

    private function authorizeGalleryImage(
        PortfolioGalleryImage $galleryImage,
    ): void {
        $profile = auth()->user()->artistProfile;

        abort_unless($profile, 404);

        $settings = $profile->portfolioSettings;

        abort_unless($settings, 404);

        abort_unless(
            $galleryImage->portfolio_setting_id === $settings->id,
            404,
        );
    }
}

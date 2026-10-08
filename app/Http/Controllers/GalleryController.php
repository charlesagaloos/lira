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
            'galleryImages' => $galleryImages,
        ]);
    }

    public function create()
    {
        return Inertia::render('Gallery/Create');
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

        return redirect()
            ->route('gallery.index')
            ->with(
                'success',
                'Gallery image added successfully.',
            );
    }

    public function edit(PortfolioGalleryImage $galleryImage)
    {
        $this->authorizeGalleryImage($galleryImage);

        return Inertia::render('Gallery/Edit', [
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

            $galleryImage->image = $newImage;

            if ($oldImage) {
                Storage::disk('public')->delete($oldImage);
            }
        }

        $galleryImage->fill([
            'title' => $validated['title'] ?? null,
            'caption' => $validated['caption'] ?? null,
            'alt_text' => $validated['alt_text'] ?? null,
        ]);

        $galleryImage->save();

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

        if ($galleryImage->image) {
            Storage::disk('public')->delete(
                $galleryImage->image,
            );
        }

        $galleryImage->delete();

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

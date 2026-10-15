<?php

namespace App\Http\Controllers;

use App\Services\ImageModerationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        return Inertia::render('Projects/Index', [
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
            'projects' => $profile->projects,
        ]);
    }

    public function create(Request $request): Response
    {
        $profile = $request->user()->artistProfile;

        return Inertia::render('Projects/Create', [
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

    public function edit(Request $request, int $project): Response
    {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        $project = $profile->projects()
            ->where('id', $project)
            ->firstOrFail();

        return Inertia::render('Projects/Edit', [
            'project' => $project,
        ]);
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
            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'project_type' => [
                'nullable',
                'string',
                'max:100',
            ],
            'url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:15360',
            ],
            'thumbnail_position_x' => [
                'required',
                'numeric',
                'between:0,100',
            ],
            'thumbnail_position_y' => [
                'required',
                'numeric',
                'between:0,100',
            ],
            'thumbnail_zoom' => [
                'required',
                'integer',
                'between:100,200',
            ],
            'thumbnail_offset_x' => [
                'required',
                'numeric',
                'between:-100,100',
            ],
            'thumbnail_offset_y' => [
                'required',
                'numeric',
                'between:-100,100',
            ],
        ]);

        $thumbnail = null;

        if ($request->hasFile('image')) {
            $moderation = $imageModerationService->check(
                $request->file('image'),
            );

            if (!$moderation['allowed']) {
                return back()
                    ->withErrors([
                        'image' => $moderation['message'],
                    ])
                    ->withInput();
            }

            $thumbnail = $request->file('image')->store(
                'projects',
                'public',
            );

            if (!$thumbnail) {
                return back()
                    ->withErrors([
                        'image' => 'Unable to store the uploaded image. Please try again.',
                    ])
                    ->withInput();
            }
        }

        unset($validated['image']);

        $slug = Str::slug($validated['title']);

        $baseSlug = $slug;
        $counter = 2;

        while (
            $profile->projects()
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $position = ($profile->projects()->max('position') ?? 0) + 1;

        try {
            $profile->projects()->create([
                ...$validated,
                'thumbnail' => $thumbnail,
                'slug' => $slug,
                'position' => $position,
                'is_visible' => true,
            ]);
        } catch (\Throwable $exception) {
            if ($thumbnail) {
                try {
                    Storage::disk('public')->delete($thumbnail);
                } catch (\Throwable $cleanupException) {
                    report($cleanupException);
                }
            }

            throw $exception;
        }

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function update(
        Request $request,
        int $project,
        ImageModerationService $imageModerationService,
    ): RedirectResponse {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        $project = $profile->projects()
            ->where('id', $project)
            ->firstOrFail();

        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'project_type' => [
                'nullable',
                'string',
                'max:100',
            ],
            'url' => [
                'nullable',
                'url',
                'max:2048',
            ],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:15360',
            ],
            'thumbnail_position_x' => [
                'required',
                'numeric',
                'between:0,100',
            ],
            'thumbnail_position_y' => [
                'required',
                'numeric',
                'between:0,100',
            ],
            'thumbnail_zoom' => [
                'required',
                'integer',
                'between:100,200',
            ],
            'thumbnail_offset_x' => [
                'required',
                'numeric',
                'between:-100,100',
            ],
            'thumbnail_offset_y' => [
                'required',
                'numeric',
                'between:-100,100',
            ],
        ]);

        $oldThumbnail = null;
        $newThumbnail = null;

        if ($request->hasFile('image')) {
            $moderation = $imageModerationService->check(
                $request->file('image'),
            );

            if (!$moderation['allowed']) {
                return back()
                    ->withErrors([
                        'image' => $moderation['message'],
                    ])
                    ->withInput();
            }

            $oldThumbnail = $project->thumbnail;

            $newThumbnail = $request->file('image')->store(
                'projects',
                'public',
            );

            if (!$newThumbnail) {
                return back()
                    ->withErrors([
                        'image' => 'Unable to store the replacement image. Your existing thumbnail has been preserved.',
                    ])
                    ->withInput();
            }

            $validated['thumbnail'] = $newThumbnail;
        }

        unset($validated['image']);

        try {
            $project->update($validated);
        } catch (\Throwable $exception) {
            if ($newThumbnail) {
                try {
                    Storage::disk('public')->delete($newThumbnail);
                } catch (\Throwable $cleanupException) {
                    report($cleanupException);
                }
            }

            throw $exception;
        }

        if (
            $oldThumbnail &&
            $oldThumbnail !== $project->thumbnail
        ) {
            Storage::disk('public')->delete($oldThumbnail);
        }

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Request $request, int $project): RedirectResponse
    {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        $project = $profile->projects()
            ->where('id', $project)
            ->firstOrFail();

        $thumbnail = $project->thumbnail;

        $project->delete();

        if ($thumbnail) {
            Storage::disk('public')->delete($thumbnail);
        }

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }


    public function toggleVisibility(Request $request, int $project): RedirectResponse
    {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        $project = $profile->projects()
            ->where('id', $project)
            ->firstOrFail();

        $project->update([
            'is_visible' => !$project->is_visible,
        ]);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project visibility updated successfully.');
    }
}

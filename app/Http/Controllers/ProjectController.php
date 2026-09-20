<?php

namespace App\Http\Controllers;

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
                'display_name',
                'verification_status',
                'is_published',
            ]),
            'projects' => $profile->projects,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Projects/Create');
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

    public function store(Request $request): RedirectResponse
    {
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

            // Image positioning
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
            $thumbnail = $request->file('image')->store(
                'projects',
                'public'
            );
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

        $profile->projects()->create([
            ...$validated,
            'thumbnail' => $thumbnail,
            'slug' => $slug,
            'position' => $position,
            'is_visible' => true,
        ]);

        return redirect()
            ->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function update(Request $request, int $project): RedirectResponse
    {
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



        if ($request->hasFile('image')) {
            $oldThumbnail = $project->thumbnail;

            $thumbnail = $request->file('image')->store('projects', 'public');

            $validated['thumbnail'] = $thumbnail;

            if ($oldThumbnail) {
                Storage::disk('public')->delete($oldThumbnail);
            }
        }

        unset($validated['image']);

        $project->update($validated);

        return redirect()
            ->route('projects.edit', $project->id)
            ->with('success', 'Project updated successfully.');
    }
    public function destroy(Request $request, int $project): RedirectResponse
    {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        $project = $profile->projects()
            ->where('id', $project)
            ->firstOrFail();

        $project->delete();

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

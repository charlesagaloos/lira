<?php

namespace App\Http\Controllers;

use App\Models\ArtistProfile;
use Inertia\Inertia;
use Inertia\Response;

class PublicProjectController extends Controller
{
    public function show(
        string $username,
        string $slug,
    ): Response {
        $profile = ArtistProfile::query()
            ->where('username', $username)
            ->where('is_published', true)
            ->firstOrFail();

        $project = $profile->projects()
            ->where('slug', $slug)
            ->where('is_visible', true)
            ->firstOrFail();

        return Inertia::render('Public/Project', [
            'profile' => $profile,
            'project' => $project,
        ]);
    }
}

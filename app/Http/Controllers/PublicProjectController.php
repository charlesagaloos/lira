<?php

namespace App\Http\Controllers;

use App\Models\ArtistProfile;
use App\VerificationStatus;
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
            ->where(
                'verification_status',
                VerificationStatus::Verified,
            )
            ->firstOrFail();

        $project = $profile->projects()
            ->where('slug', $slug)
            ->where('is_visible', true)
            ->firstOrFail();

        return Inertia::render('Public/Project', [
            'profile' => [
                'username' => $profile->username,
                'display_name' => $profile->display_name,
            ],
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'description' => $project->description,
                'project_type' => $project->project_type,
                'thumbnail' => $project->thumbnail,
                'url' => $project->url,
            ],
        ]);
    }
}

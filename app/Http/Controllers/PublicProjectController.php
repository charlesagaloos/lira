<?php

namespace App\Http\Controllers;

use App\Models\ArtistProfile;
use App\VerificationStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicProjectController extends Controller
{
    public function show(
        Request $request,
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

        if ($request->user()?->id !== $profile->user_id) {
            $viewSessionKey = 'project_viewed_' . $project->id;

            if (!$request->session()->has($viewSessionKey)) {
                $project->views()->create([
                    'viewed_at' => now(),
                ]);

                $request->session()->put($viewSessionKey, true);
            }
        }

        $settings = $profile->portfolioSettings;

        return Inertia::render('Public/Project', [
            'profile' => [
                'username' => $profile->username,
                'display_name' => $profile->display_name,
                'portfolio_settings' => [
                    'template' => $settings?->template ?? 'default',
                    'background_color' => $settings?->background_color ?? '#09090b',
                    'text_color' => $settings?->text_color ?? '#ffffff',
                    'primary_color' => $settings?->primary_color ?? '#ffffff',
                    'accent_color' => $settings?->accent_color ?? '#a1a1aa',
                    'hover_color' => $settings?->hover_color ?? '#ffffff',
                    'surface_color' => $settings?->surface_color ?? '#111113',
                    'muted_text_color' => $settings?->muted_text_color ?? '#a1a1aa',
                    'border_color' => $settings?->border_color ?? '#ffffff24',
                    'card_background_color' => $settings?->card_background_color ?? '#111113',
                    'card_text_color' => $settings?->card_text_color ?? '#ffffff',
                    'card_accent_color' => $settings?->card_accent_color ?? '#a1a1aa',
                    'card_primary_color' => $settings?->card_primary_color ?? '#ffffff',
                    'card_hover_color' => $settings?->card_hover_color ?? '#27272a',
                ],
            ],
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'slug' => $project->slug,
                'description' => $project->description,
                'project_type' => $project->project_type,
                'thumbnail' => $project->thumbnail,
                'thumbnail_position_x' => $project->thumbnail_position_x,
                'thumbnail_position_y' => $project->thumbnail_position_y,
                'thumbnail_zoom' => $project->thumbnail_zoom,
                'thumbnail_offset_x' => $project->thumbnail_offset_x,
                'thumbnail_offset_y' => $project->thumbnail_offset_y,
                'url' => $project->url,
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\ArtistProfile;
use App\VerificationStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicPortfolioController extends Controller
{
    public function show(Request $request, string $username): Response
    {
        $profile = ArtistProfile::query()
            ->where('username', $username)
            ->firstOrFail();

        $isOwner = $request->user()?->id === $profile->user_id;

        if (
            !$profile->is_published ||
            $profile->verification_status !== VerificationStatus::Verified
        ) {
            return Inertia::render('Public/PortfolioUnavailable', [
                'username' => $profile->username,
                'isOwner' => $isOwner,
                'status' => $isOwner
                    ? $profile->verification_status->value
                    : 'pending',
                'isPublished' => (bool) $profile->is_published,
            ]);
        }

        $profile->load([
            'socialLinks' => fn($query) => $query
                ->where('is_visible', true)
                ->orderBy('position'),

            'portfolioSettings.navigationItems' => fn($query) => $query
                ->where('is_visible', true)
                ->orderBy('sort_order'),

            'portfolioSettings.galleryImages',

            'projects' => fn($query) => $query
                ->where('is_visible', true)
                ->orderBy('position'),

            'releases' => fn($query) => $query
                ->where('is_visible', true)
                ->orderByDesc('release_date')
                ->orderBy('position'),
        ]);

        if (!$isOwner) {
            $viewSessionKey = 'portfolio_viewed_' . $profile->id;

            if (!$request->session()->has($viewSessionKey)) {
                $profile->portfolioViews()->create([
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'viewed_at' => now(),
                ]);

                $request->session()->put(
                    $viewSessionKey,
                    true,
                );
            }
        }

        $publicProfile = $profile->only([
            'id',
            'username',
            'display_name',
            'bio',
            'about_me',
            'artist_type',
            'location',
            'website',
            'avatar',
            'avatar_zoom',
            'avatar_position_x',
            'avatar_position_y',
            'cover_image',
        ]);

        $publicProfile['social_links'] = $profile->socialLinks
            ->map(fn($link) => $link->only([
                'id',
                'platform',
                'url',
                'position',
                'is_visible',
            ]))
            ->values();

        if ($profile->portfolioSettings) {
            $settings = $profile->portfolioSettings;

            $publicSettings = $settings->only([
                'id',
                'template',

                // Global colors
                'primary_color',
                'background_color',
                'text_color',
                'accent_color',
                'hover_color',
                'surface_color',
                'muted_text_color',
                'border_color',

                // Project card colors
                'card_background_color',
                'card_text_color',
                'card_accent_color',
                'card_primary_color',
                'card_hover_color',

                // Cover image
                'cover_image',
                'cover_image_position_x',
                'cover_image_position_y',
                'cover_image_zoom',
                'cover_image_offset_x',
                'cover_image_offset_y',

                // Hero
                'show_hero',
                'hero_label',
                'hero_statement',

                // Work
                'show_work',
                'work_label',
                'work_description',

                // About and artist message
                'show_about',
                'about_label',
                'show_artist_message',
                'artist_message_label',
                'artist_message',
                'canvas_background_text',

                // Gallery
                'show_gallery',
                'gallery_label',
                'gallery_description',
                'gallery_display',
                'gallery_columns',
                'gallery_image_aspect',
                'gallery_show_captions',
                'gallery_show_titles',
                'gallery_enable_lightbox',
                'gallery_responsive',

                // Music
                'show_music',
                'music_label',
                'music_release_display',
                'music_release_limit',
                'featured_release_id',
                'show_music_links',

                // Navigation
                'show_navigation',

                // Footer
                'show_footer',
                'footer_label',
                'footer_message',
                'show_footer_socials',
                'footer_logo',
                'copyright_text',
                'show_powered_by_lira',
            ]);

            $publicSettings = array_merge($publicSettings, [
                'navigation_items' => $settings->navigationItems
                    ->map(fn($item) => $item->only([
                        'id',
                        'label',
                        'destination',
                        'url',
                        'sort_order',
                        'is_visible',
                    ]))
                    ->values(),

                'gallery_images' => $settings->galleryImages
                    ->map(fn($image) => $image->only([
                        'id',
                        'image',
                        'title',
                        'caption',
                        'alt_text',
                        'sort_order',
                    ]))
                    ->values(),
            ]);

            $publicProfile['portfolio_settings'] = $publicSettings;
        }

        $publicProfile['projects'] = $profile->projects
            ->map(fn($project) => $project->only([
                'id',
                'title',
                'slug',
                'description',
                'project_type',
                'thumbnail',
                'thumbnail_position_x',
                'thumbnail_position_y',
                'thumbnail_zoom',
                'thumbnail_offset_x',
                'thumbnail_offset_y',
                'url',
            ]))
            ->values();

        $publicProfile['releases'] = $profile->releases
            ->map(fn($release) => $release->only([
                'id',
                'title',
                'release_type',
                'artwork',
                'release_date',
                'description',
                'spotify_url',
                'apple_music_url',
                'youtube_url',
                'soundcloud_url',
                'bandcamp_url',
                'lyrics',
            ]))
            ->values();

        return Inertia::render('Public/Portfolio', [
            'profile' => $publicProfile,
        ]);
    }
}

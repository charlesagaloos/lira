<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'artist_profile_id',

    /*Template*/
    'template',

    /*Global Colors*/
    'primary_color',
    'background_color',
    'text_color',
    'accent_color',
    'hover_color',
    'surface_color',
    'muted_text_color',
    'border_color',

    /*Project Card Colors*/
    'card_background_color',
    'card_text_color',
    'card_accent_color',
    'card_primary_color',
    'card_hover_color',

    /*Cover*/
    'cover_image',
    'cover_image_position_x',
    'cover_image_position_y',
    'cover_image_zoom',
    'cover_image_offset_x',
    'cover_image_offset_y',

    /*Hero*/
    'show_hero',
    'hero_label',
    'hero_statement',

    /*Work*/
    'show_work',
    'work_label',
    'work_description',

    /*About*/
    'show_about',
    'about_label',

    /*Artist Message*/
    'show_artist_message',
    'artist_message_label',
    'artist_message',
    'canvas_background_text',

    /*Gallery*/
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

    /*Music*/
    'show_music',
    'music_label',
    'music_release_display',
    'music_release_limit',
    'featured_release_id',
    'show_music_links',

    /*Navigation*/
    'show_navigation',

    /*Footer*/
    'show_footer',
    'footer_label',
    'footer_message',
    'show_footer_socials',
    'footer_logo',
    'copyright_text',
    'show_powered_by_lira',
])]
class PortfolioSetting extends Model
{
    protected function casts(): array
    {
        return [
            'cover_image_position_x' => 'float',
            'cover_image_position_y' => 'float',
            'cover_image_zoom' => 'float',
            'cover_image_offset_x' => 'float',
            'cover_image_offset_y' => 'float',

            'show_hero' => 'boolean',
            'show_work' => 'boolean',
            'show_about' => 'boolean',

            'show_artist_message' => 'boolean',

            'show_gallery' => 'boolean',
            'gallery_columns' => 'integer',
            'gallery_show_captions' => 'boolean',
            'gallery_show_titles' => 'boolean',
            'gallery_enable_lightbox' => 'boolean',
            'gallery_responsive' => 'array',

            'show_music' => 'boolean',
            'music_release_limit' => 'integer',
            'featured_release_id' => 'integer',

            'show_navigation' => 'boolean',
            'show_footer' => 'boolean',
            'show_footer_socials' => 'boolean',
            'show_powered_by_lira' => 'boolean',
        ];
    }

    public function artistProfile(): BelongsTo
    {
        return $this->belongsTo(ArtistProfile::class);
    }

    public function featuredRelease(): BelongsTo
    {
        return $this->belongsTo(
            Release::class,
            'featured_release_id',
        );
    }

    public function galleryImages(): HasMany
    {
        return $this->hasMany(
            PortfolioGalleryImage::class,
        )->orderBy('sort_order');
    }

    public function navigationItems(): HasMany
    {
        return $this->hasMany(
            PortfolioNavigationItem::class,
        )->orderBy('sort_order');
    }
}

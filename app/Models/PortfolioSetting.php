<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'artist_profile_id',
    'template',
    'primary_color',
    'background_color',
    'text_color',
    'accent_color',
    'card_background_color',
    'card_text_color',
    'card_accent_color',
    'cover_image',
    'cover_image_position_x',
    'cover_image_position_y',
    'cover_image_zoom',
    'cover_image_offset_x',
    'cover_image_offset_y',
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
        ];
    }

    public function artistProfile(): BelongsTo
    {
        return $this->belongsTo(ArtistProfile::class);
    }
}

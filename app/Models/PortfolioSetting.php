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
])]
class PortfolioSetting extends Model
{
    public function artistProfile(): BelongsTo
    {
        return $this->belongsTo(ArtistProfile::class);
    }
}

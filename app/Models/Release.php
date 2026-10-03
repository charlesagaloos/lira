<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'artist_profile_id',
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
    'position',
    'is_visible',
])]
class Release extends Model
{
    public function artistProfile(): BelongsTo
    {
        return $this->belongsTo(ArtistProfile::class);
    }

    protected function casts(): array
    {
        return [
            'release_date' => 'date',
            'position' => 'integer',
            'is_visible' => 'boolean',
        ];
    }
}

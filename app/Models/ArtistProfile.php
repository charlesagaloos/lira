<?php

namespace App\Models;

use App\VerificationStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'username',
    'display_name',
    'bio',
    'artist_type',
    'location',
    'avatar',
    'cover_image',
    'website',
    'is_published',
    'spotify_artist_url',
    'apple_music_artist_url',
    'verification_status',
    'verified_at',
])]
class ArtistProfile extends Model
{
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'verified_at' => 'datetime',
            'verification_status' => VerificationStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

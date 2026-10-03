<?php

namespace App\Models;

use App\VerificationStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'user_id',
    'username',
    'display_name',
    'bio',
    'about_me',
    'artist_type',
    'location',
    'avatar',
    'avatar_zoom',
    'avatar_position_x',
    'avatar_position_y',
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
            'avatar_zoom' => 'float',
            'avatar_position_x' => 'float',
            'avatar_position_y' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class)
            ->orderBy('position');
    }

    public function portfolioSettings(): HasOne
    {
        return $this->hasOne(PortfolioSetting::class);
    }

    public function socialLinks(): HasMany
    {
        return $this->hasMany(ArtistSocialLink::class)
            ->orderBy('position');
    }

    public function portfolioViews(): HasMany
    {
        return $this->hasMany(PortfolioView::class);
    }

    public function releases(): HasMany
    {
        return $this->hasMany(Release::class)
            ->orderBy('position');
    }
}

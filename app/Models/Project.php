<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'artist_profile_id',
    'title',
    'slug',
    'description',
    'project_type',
    'thumbnail',
    'url',
    'position',
    'is_visible',
    'thumbnail_position_x',
    'thumbnail_position_y',
    'thumbnail_zoom',
    'thumbnail_offset_x',
    'thumbnail_offset_y',
])]
class Project extends Model
{
    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'position' => 'integer',
            'thumbnail_position_x' => 'integer',
            'thumbnail_position_y' => 'integer',
            'thumbnail_zoom' => 'integer',
            'thumbnail_offset_x' => 'float',
            'thumbnail_offset_y' => 'float',
        ];
    }

    public function artistProfile(): BelongsTo
    {
        return $this->belongsTo(ArtistProfile::class);
    }
}

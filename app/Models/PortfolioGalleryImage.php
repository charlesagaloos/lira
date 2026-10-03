<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'portfolio_setting_id',

    /* Gallery */
    'image',
    'title',
    'caption',
    'alt_text',
    'sort_order',
])]
class PortfolioGalleryImage extends Model
{
    public function portfolioSetting(): BelongsTo
    {
        return $this->belongsTo(
            PortfolioSetting::class,
        );
    }
}

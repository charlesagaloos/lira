<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'portfolio_setting_id',
    'label',
    'destination',
    'url',
    'sort_order',
    'is_visible',
])]
class PortfolioNavigationItem extends Model
{
    public function portfolioSetting(): BelongsTo
    {
        return $this->belongsTo(
            PortfolioSetting::class,
            'portfolio_setting_id',
        );
    }

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_visible' => 'boolean',
        ];
    }
}

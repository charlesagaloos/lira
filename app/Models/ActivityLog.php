<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'event_type',
        'category',
        'ip_address',
        'user_agent',
        'route_name',
        'http_method',
        'status_code',
        'details',
        'is_flagged',
        'flag_reason',
        'reviewed_at',
        'reviewed_by',
        'occurred_at',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
            'is_flagged' => 'boolean',
            'reviewed_at' => 'datetime',
            'occurred_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}

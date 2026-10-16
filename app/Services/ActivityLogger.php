<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;

class ActivityLogger
{
    /**
     * @param array<string, mixed>|null $details
     */
    public function record(
        Request $request,
        ?User $user,
        string $eventType,
        string $category,
        ?array $details = null,
        ?string $flagReason = null,
        ?int $statusCode = null,
    ): ActivityLog {
        return ActivityLog::create([
            'user_id' => $user?->id,
            'event_type' => $eventType,
            'category' => $category,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'route_name' => $request->route()?->getName(),
            'http_method' => $request->method(),
            'status_code' => $statusCode,
            'details' => $details,
            'is_flagged' => $flagReason !== null,
            'flag_reason' => $flagReason,
            'occurred_at' => now(),
        ]);
    }
}

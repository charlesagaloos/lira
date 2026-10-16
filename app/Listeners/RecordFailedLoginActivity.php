<?php

namespace App\Listeners;

use App\Models\ActivityLog;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Auth\Events\Failed;
use Illuminate\Http\Request;

class RecordFailedLoginActivity
{
    public function __construct(
        private ActivityLogger $activityLogger,
        private Request $request,
    ) {}

    public function handle(Failed $event): void
    {
        $ipAddress = $this->request->ip();
        $recentFailures = $ipAddress === null
            ? 0
            : ActivityLog::query()
                ->where('event_type', 'auth.login_failed')
                ->where('ip_address', $ipAddress)
                ->where('occurred_at', '>=', now()->subMinutes(10))
                ->count();

        $alreadyFlagged = $ipAddress !== null
            && ActivityLog::query()
                ->where('event_type', 'auth.login_failed')
                ->where('ip_address', $ipAddress)
                ->where('is_flagged', true)
                ->where('occurred_at', '>=', now()->subMinutes(10))
                ->exists();

        $flagReason = $recentFailures >= 4 && !$alreadyFlagged
            ? 'At least 5 failed sign-ins from this IP within 10 minutes.'
            : null;

        $user = $event->user instanceof User ? $event->user : null;

        $this->activityLogger->record(
            $this->request,
            $user,
            'auth.login_failed',
            'authentication',
            ['username_field' => 'email'],
            $flagReason,
        );
    }
}

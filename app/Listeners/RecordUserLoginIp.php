<?php

namespace App\Listeners;

use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;

class RecordUserLoginIp
{
    public function __construct(
        private ActivityLogger $activityLogger,
        private Request $request,
    ) {}

    public function handle(Login $event): void
    {
        if (!$event->user instanceof User) {
            return;
        }

        $ipAddress = request()->ip();

        if ($ipAddress === null) {
            return;
        }

        $event->user->forceFill([
            'last_login_ip_address' => $ipAddress,
        ])->save();

        $this->activityLogger->record(
            $this->request,
            $event->user,
            'auth.login',
            'authentication',
        );
    }
}

<?php

namespace App\Listeners;

use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;

class RecordPasswordResetActivity
{
    public function __construct(
        private ActivityLogger $activityLogger,
        private Request $request,
    ) {}

    public function handle(PasswordReset $event): void
    {
        $user = $event->user instanceof User ? $event->user : null;

        $this->activityLogger->record(
            $this->request,
            $user,
            'auth.password_reset',
            'authentication',
        );
    }
}

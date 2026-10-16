<?php

namespace App\Listeners;

use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Auth\Events\Logout;
use Illuminate\Http\Request;

class RecordLogoutActivity
{
    public function __construct(
        private ActivityLogger $activityLogger,
        private Request $request,
    ) {}

    public function handle(Logout $event): void
    {
        $user = $event->user instanceof User ? $event->user : null;

        $this->activityLogger->record(
            $this->request,
            $user,
            'auth.logout',
            'authentication',
        );
    }
}

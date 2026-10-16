<?php

namespace App\Listeners;

use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;

class RecordRegisteredActivity
{
    public function __construct(
        private ActivityLogger $activityLogger,
        private Request $request,
    ) {}

    public function handle(Registered $event): void
    {
        $user = $event->user instanceof User ? $event->user : null;

        $this->activityLogger->record(
            $this->request,
            $user,
            'auth.registered',
            'authentication',
        );
    }
}

<?php

use Illuminate\Foundation\Inspiring;
use App\Models\ActivityLog;
use App\Models\BlockedIp;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('activity-logs:prune', function () {
    $cutoff = now()->subYear();

    $deletedLogs = ActivityLog::query()
        ->where('occurred_at', '<', $cutoff)
        ->delete();

    $deletedBlocks = BlockedIp::query()
        ->where('expires_at', '<', $cutoff)
        ->delete();

    $this->info("Deleted {$deletedLogs} activity logs and {$deletedBlocks} expired IP blocks.");
})->purpose('Delete activity logs and expired IP blocks older than one year');

Schedule::command('activity-logs:prune')->daily();

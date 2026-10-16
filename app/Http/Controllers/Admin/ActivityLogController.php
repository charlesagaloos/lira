<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\BlockedIp;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'category' => ['nullable', 'in:all,authentication,account_changes,moderation,content_changes,security_signals'],
            'search' => ['nullable', 'string', 'max:100'],
            'flagged' => ['nullable', 'in:all,flagged,reviewed,normal'],
        ]);

        $category = $filters['category'] ?? 'all';
        $search = trim($filters['search'] ?? '');
        $flagged = $filters['flagged'] ?? 'all';

        $logs = ActivityLog::query()
            ->with('user:id,name,email')
            ->when($category !== 'all', fn(Builder $query) => $query->where('category', $category))
            ->when($flagged === 'flagged', fn(Builder $query) => $query->where('is_flagged', true)->whereNull('reviewed_at'))
            ->when($flagged === 'reviewed', fn(Builder $query) => $query->where('is_flagged', true)->whereNotNull('reviewed_at'))
            ->when($flagged === 'normal', fn(Builder $query) => $query->where('is_flagged', false))
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $searchQuery) use ($search) {
                    $searchQuery
                        ->where('event_type', 'like', "%{$search}%")
                        ->orWhere('ip_address', 'like', "%{$search}%")
                        ->orWhere('route_name', 'like', "%{$search}%")
                        ->orWhereHas('user', function (Builder $userQuery) use ($search) {
                            $userQuery
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->latest('occurred_at')
            ->paginate(25)
            ->withQueryString()
            ->through(fn(ActivityLog $log) => [
                'id' => $log->id,
                'event_type' => $log->event_type,
                'category' => $log->category,
                'ip_address' => $log->ip_address,
                'route_name' => $log->route_name,
                'http_method' => $log->http_method,
                'status_code' => $log->status_code,
                'details' => $log->details,
                'is_flagged' => $log->is_flagged,
                'flag_reason' => $log->flag_reason,
                'reviewed_at' => $log->reviewed_at?->toIso8601String(),
                'occurred_at' => $log->occurred_at?->toIso8601String(),
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                    'email' => $log->user->email,
                ] : null,
            ]);

        $activeBlocks = BlockedIp::query()
            ->active()
            ->with('blocker:id,name')
            ->latest()
            ->get()
            ->map(fn(BlockedIp $block) => [
                'id' => $block->id,
                'ip_address' => $block->ip_address,
                'reason' => $block->reason,
                'expires_at' => $block->expires_at->toIso8601String(),
                'blocked_by' => $block->blocker?->name,
                'created_at' => $block->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs' => $logs,
            'activeBlocks' => $activeBlocks,
            'flaggedCount' => ActivityLog::query()
                ->where('is_flagged', true)
                ->whereNull('reviewed_at')
                ->count(),
            'filters' => [
                'category' => $category,
                'search' => $search,
                'flagged' => $flagged,
            ],
        ]);
    }

    public function review(
        Request $request,
        ActivityLog $activityLog,
        ActivityLogger $activityLogger,
    ): RedirectResponse {
        if ($activityLog->is_flagged && $activityLog->reviewed_at === null) {
            $activityLog->update([
                'reviewed_at' => now(),
                'reviewed_by' => $request->user()->id,
            ]);

            $activityLogger->record(
                $request,
                $request->user(),
                'moderation.activity_reviewed',
                'moderation',
                ['activity_log_id' => $activityLog->id],
            );
        }

        return redirect()
            ->route('admin.activity-logs.index')
            ->with('success', 'Activity flag marked as reviewed.');
    }

    public function blockIp(Request $request, ActivityLogger $activityLogger): RedirectResponse
    {
        $validated = $request->validate([
            'ip_address' => ['required', 'ip'],
            'duration_minutes' => ['required', 'integer', 'in:60,360,720,1440'],
            'reason' => ['required', 'string', 'min:5', 'max:500'],
        ]);

        $alreadyBlocked = BlockedIp::active()
            ->where('ip_address', $validated['ip_address'])
            ->exists();

        if ($alreadyBlocked) {
            throw ValidationException::withMessages([
                'ip_address' => 'This IP address already has an active block.',
            ]);
        }

        $block = BlockedIp::create([
            'ip_address' => $validated['ip_address'],
            'reason' => $validated['reason'],
            'blocked_by' => $request->user()->id,
            'expires_at' => now()->addMinutes((int) $validated['duration_minutes']),
        ]);

        $activityLogger->record(
            $request,
            $request->user(),
            'moderation.ip_blocked',
            'moderation',
            [
                'blocked_ip' => $block->ip_address,
                'expires_at' => $block->expires_at->toIso8601String(),
                'reason' => $block->reason,
            ],
        );

        return redirect()
            ->route('admin.activity-logs.index')
            ->with('success', 'IP address blocked until ' . $block->expires_at->toDayDateTimeString() . '.');
    }

    public function unblockIp(
        Request $request,
        BlockedIp $blockedIp,
        ActivityLogger $activityLogger,
    ): RedirectResponse {
        if ($blockedIp->unblocked_at === null) {
            $blockedIp->update([
                'unblocked_at' => now(),
                'unblocked_by' => $request->user()->id,
            ]);
        }

        $activityLogger->record(
            $request,
            $request->user(),
            'moderation.ip_unblocked',
            'moderation',
            [
                'blocked_ip' => $blockedIp->ip_address,
                'original_reason' => $blockedIp->reason,
            ],
        );

        return redirect()
            ->route('admin.activity-logs.index')
            ->with('success', 'IP address unblocked.');
    }
}

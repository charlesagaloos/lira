<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use App\Models\User;
use App\Services\ActivityLogger;
use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class RecordUserActivity
{
    public function __construct(
        private ActivityLogger $activityLogger,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        try {
            $response = $next($request);
        } catch (AuthorizationException $exception) {
            $this->recordDeniedRequest($request, 403);

            throw $exception;
        } catch (HttpExceptionInterface $exception) {
            if (
                $exception->getStatusCode() === 429
                && $request->routeIs('login.store')
            ) {
                throw $exception;
            }

            if (in_array($exception->getStatusCode(), [403, 429], true)) {
                $this->recordDeniedRequest($request, $exception->getStatusCode());
            }

            throw $exception;
        }

        if (in_array($response->getStatusCode(), [403, 429], true)) {
            $this->recordDeniedRequest($request, $response->getStatusCode());
            return $response;
        }

        if (in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'], true)) {
            return $response;
        }

        $routeName = $request->route()?->getName() ?? 'unknown';

        if (in_array($routeName, [
            'admin.activity-logs.review',
            'admin.activity-logs.block-ip',
            'admin.activity-logs.unblock-ip',
            'login.store',
            'register.store',
        ], true)) {
            return $response;
        }

        $user = $request->user();

        if (!$user instanceof User) {
            return $response;
        }

        $category = $this->categoryForRoute($routeName);
        $details = [
            'route' => $routeName,
            'method' => $request->method(),
            'status' => $response->getStatusCode(),
        ];

        $flagReason = null;

        if ($response->getStatusCode() < 400 && $request->ip() !== null) {
            $recentWrites = ActivityLog::query()
                ->where('user_id', $user->id)
                ->where('ip_address', $request->ip())
                ->whereIn('category', ['account_changes', 'content_changes', 'moderation'])
                ->where('occurred_at', '>=', now()->subMinute())
                ->count();

            if ($recentWrites >= 29) {
                $flagReason = 'At least 30 sensitive write actions by this user/IP within 1 minute.';
            }
        }

        $this->activityLogger->record(
            $request,
            $user,
            'activity.write',
            $category,
            $details,
            $flagReason,
            $response->getStatusCode(),
        );

        return $response;
    }

    private function recordDeniedRequest(Request $request, int $statusCode): void
    {
        $rateLimited = $statusCode === 429;

        $this->activityLogger->record(
            $request,
            $request->user() instanceof User ? $request->user() : null,
            $rateLimited ? 'security.rate_limited' : 'security.access_denied',
            'security_signals',
            [
                'route' => $request->route()?->getName(),
                'method' => $request->method(),
                'status' => $statusCode,
            ],
            $rateLimited ? 'Request was rate limited.' : 'Request was denied access.',
            $statusCode,
        );
    }

    private function categoryForRoute(string $routeName): string
    {
        if (str_starts_with($routeName, 'admin.')) {
            return 'moderation';
        }

        if (preg_match('/^(projects|gallery|releases|portfolio)\\./', $routeName)) {
            return 'content_changes';
        }

        return 'account_changes';
    }
}

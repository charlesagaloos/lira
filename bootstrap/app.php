<?php

use App\Http\Middleware\EnsureArtistIsVerified;
use App\Http\Middleware\BlockAuthenticationForBlockedIp;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RecordUserActivity;
use App\Services\ActivityLogger;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            BlockAuthenticationForBlockedIp::class,
            HandleInertiaRequests::class,
            RecordUserActivity::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\Admin::class,
            'verified.artist' => EnsureArtistIsVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ThrottleRequestsException $exception, Request $request) {
            if ($request->routeIs('login.store')) {
                app(ActivityLogger::class)->record(
                    $request,
                    null,
                    'security.rate_limited',
                    'security_signals',
                    [
                        'route' => $request->route()?->getName(),
                        'method' => $request->method(),
                        'status' => 429,
                    ],
                    'Request was rate limited.',
                    429,
                );

                return redirect()
                    ->route('login')
                    ->with('error', 'Too many login attempts. Please wait a minute before trying again.');
            }

            return null;
        });

        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })
    ->create();

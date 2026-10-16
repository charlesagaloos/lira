<?php

namespace App\Http\Middleware;

use App\Models\BlockedIp;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BlockAuthenticationForBlockedIp
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$this->isAuthenticationRequest($request)) {
            return $next($request);
        }

        if ($request->user()?->can('admin')) {
            return $next($request);
        }

        $ipAddress = $request->ip();

        $block = $ipAddress === null
            ? null
            : BlockedIp::active()->where('ip_address', $ipAddress)->first();

        if ($block !== null) {
            $message = 'Authentication from this network is temporarily blocked. Please try again later.';

            if ($request->isMethod('GET') && $request->is('login')) {
                $request->session()->flash('error', $message);

                return $next($request);
            }

            return redirect()
                ->route('login')
                ->with('error', $message);
        }

        return $next($request);
    }

    private function isAuthenticationRequest(Request $request): bool
    {
        return $request->is(
            'login',
            'register',
            'forgot-password',
            'reset-password',
            'reset-password/*',
            'auth/google',
            'auth/google/callback',
            'two-factor-challenge',
            'email/verification-notification',
            'confirm-password',
        );
    }
}

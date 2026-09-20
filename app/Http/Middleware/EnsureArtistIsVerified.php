<?php

namespace App\Http\Middleware;

use App\VerificationStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureArtistIsVerified
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        $profile = $request->user()?->artistProfile;

        if (!$profile) {
            return redirect()
                ->route('profile.create');
        }

        if ($profile->verification_status !== VerificationStatus::Verified) {
            return redirect()
                ->route('dashboard')
                ->with(
                    'error',
                    'Your artist profile must be verified before you can access this section.'
                );
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Controllers;

use App\VerificationStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function publish(Request $request): RedirectResponse
    {
        $profile = $request->user()->artistProfile;

        abort_unless($profile, 404);

        abort_unless(
            $profile->verification_status === VerificationStatus::Verified,
            403,
        );

        $profile->update([
            'is_published' => true,
        ]);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Portfolio published successfully.');
    }
}

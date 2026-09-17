<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\VerificationStatus;
use App\Models\ArtistProfile;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ArtistVerificationController extends Controller
{
    public function index(): Response
    {
        $profiles = ArtistProfile::query()
            ->where('verification_status', VerificationStatus::Pending)
            ->with('user:id,name,email')
            ->latest()
            ->get();

        return Inertia::render('Admin/ArtistVerifications/Index', [
            'profiles' => $profiles,
        ]);
    }

    public function verify(ArtistProfile $profile): RedirectResponse
    {
        $profile->update([
            'verification_status' => VerificationStatus::Verified,
            'verified_at' => now(),
        ]);

        return redirect()
            ->route('admin.verifications.index')
            ->with('success', 'Artist verified successfully.');
    }

    public function reject(ArtistProfile $profile): RedirectResponse
    {
        $profile->update([
            'verification_status' => VerificationStatus::Rejected,
            'verified_at' => null,
        ]);

        return redirect()
            ->route('admin.verifications.index')
            ->with('success', 'Artist verification rejected.');
    }
}

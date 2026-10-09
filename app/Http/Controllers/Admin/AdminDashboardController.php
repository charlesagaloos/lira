<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArtistProfile;
use App\VerificationStatus;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $totalArtists = ArtistProfile::count();

        $pendingVerification = ArtistProfile::where(
            'verification_status',
            VerificationStatus::Pending,
        )->count();

        $verifiedArtists = ArtistProfile::where(
            'verification_status',
            VerificationStatus::Verified,
        )->count();

        $rejectedArtists = ArtistProfile::where(
            'verification_status',
            VerificationStatus::Rejected,
        )->count();

        $recentVerifications = ArtistProfile::query()
            ->where(
                'verification_status',
                VerificationStatus::Pending,
            )
            ->with('user:id,name,email')
            ->latest()
            ->take(5)
            ->get([
                'id',
                'user_id',
                'username',
                'display_name',
                'artist_type',
                'location',
                'verification_status',
                'updated_at',
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalArtists' => $totalArtists,
                'pendingVerification' => $pendingVerification,
                'verifiedArtists' => $verifiedArtists,
                'rejectedArtists' => $rejectedArtists,
            ],

            'recentVerifications' => $recentVerifications,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArtistProfile;
use App\VerificationStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ArtistVerificationController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'artist_type' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'in:10,25,50'],
        ]);

        $search = trim($validated['search'] ?? '');
        $artistType = $validated['artist_type'] ?? 'all';
        $perPage = (int) ($validated['per_page'] ?? 10);

        $query = ArtistProfile::query()
            ->where('verification_status', VerificationStatus::Pending)
            ->whereHas('user')
            ->with([
                'user:id,name,email',
                'socialLinks',
            ]);

        if ($search !== '') {
            $query->where(function (Builder $builder) use ($search) {
                $builder
                    ->where('display_name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('artist_type', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhereHas('user', function (Builder $userQuery) use ($search) {
                        $userQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($artistType !== 'all') {
            $query->where('artist_type', $artistType);
        }

        $profiles = $query
            ->latest('updated_at')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn(ArtistProfile $profile) => [
                'id' => $profile->id,
                'username' => $profile->username,
                'display_name' => $profile->display_name,
                'bio' => $profile->bio,
                'artist_type' => $profile->artist_type,
                'location' => $profile->location,
                'avatar' => $profile->avatar,
                'avatar_zoom' => $profile->avatar_zoom,
                'avatar_position_x' => $profile->avatar_position_x,
                'avatar_position_y' => $profile->avatar_position_y,
                'spotify_artist_url' => $profile->spotify_artist_url,
                'apple_music_artist_url' => $profile->apple_music_artist_url,
                'verification_status' => $profile->verification_status instanceof \BackedEnum
                    ? $profile->verification_status->value
                    : (string) $profile->verification_status,
                'social_links' => $profile->socialLinks,
                'user' => $profile->user ? [
                    'id' => $profile->user->id,
                    'name' => $profile->user->name,
                    'email' => $profile->user->email,
                ] : null,
            ]);

        $pendingCount = ArtistProfile::query()
            ->where('verification_status', VerificationStatus::Pending)
            ->whereHas('user')
            ->count();

        $artistTypes = ArtistProfile::query()
            ->where('verification_status', VerificationStatus::Pending)
            ->whereHas('user')
            ->whereNotNull('artist_type')
            ->where('artist_type', '!=', '')
            ->distinct()
            ->orderBy('artist_type')
            ->pluck('artist_type')
            ->values();

        return Inertia::render('Admin/ArtistVerifications/Index', [
            'profiles' => $profiles,
            'filters' => [
                'search' => $search,
                'artist_type' => $artistType,
                'per_page' => $perPage,
            ],
            'pendingCount' => $pendingCount,
            'artistTypes' => $artistTypes,
        ]);
    }

    public function verify(ArtistProfile $profile): RedirectResponse
    {
        if ($profile->verification_status !== VerificationStatus::Pending) {
            throw ValidationException::withMessages([
                'verification' => 'This artist is no longer pending verification.',
            ]);
        }

        $profile->update([
            'verification_status' => VerificationStatus::Verified,
            'verified_at' => now(),
        ]);

        return redirect()
            ->route('admin.verifications.index')
            ->with('success', 'Artist verified successfully.');
    }

    public function reject(
        Request $request,
        ArtistProfile $profile
    ): RedirectResponse {
        $validated = $request->validate([
            'rejection_reason' => [
                'required',
                'string',
                'min:10',
                'max:2000',
            ],
        ]);

        if ($profile->verification_status !== VerificationStatus::Pending) {
            throw ValidationException::withMessages([
                'verification' => 'This artist is no longer pending verification.',
            ]);
        }

        $profile->update([
            'verification_status' => VerificationStatus::Rejected,
            'verified_at' => null,
            'rejection_reason' => trim($validated['rejection_reason']),
        ]);

        return redirect()
            ->route('admin.verifications.index')
            ->with('success', 'Artist verification rejected.');
    }
}

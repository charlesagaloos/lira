<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;
use App\Models\ArtistProfile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtistController extends Controller
{
    /**
     * Display the artist directory.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'status' => ['nullable', 'in:all,pending,verified,rejected'],
            'search' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'in:10,25,50'],
        ]);

        $status = $validated['status'] ?? 'all';
        $search = trim($validated['search'] ?? '');
        $perPage = (int) ($validated['per_page'] ?? 10);

        $query = ArtistProfile::query()
            ->whereHas('user')
            ->with('user:id,name,email,is_admin,created_at');

        if ($status !== 'all') {
            $query->where('verification_status', $status);
        }

        if ($search !== '') {
            $query->where(function (Builder $builder) use ($search) {
                $builder
                    ->where('display_name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhereHas('user', function (Builder $userQuery) use ($search) {
                        $userQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $profiles = $query
            ->latest('updated_at')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn(ArtistProfile $profile) => [
                'id' => $profile->id,
                'username' => $profile->username,
                'display_name' => $profile->display_name,
                'avatar' => $profile->avatar,
                'avatar_zoom' => $profile->avatar_zoom,
                'avatar_position_x' => $profile->avatar_position_x,
                'avatar_position_y' => $profile->avatar_position_y,
                'artist_type' => $profile->artist_type,
                'location' => $profile->location,
                'verification_status' => $this->verificationStatus($profile),
                'spotify_artist_url' => $profile->spotify_artist_url,
                'apple_music_artist_url' => $profile->apple_music_artist_url,
                'is_published' => (bool) $profile->is_published,
                'updated_at' => $profile->updated_at,
                'created_at' => $profile->created_at,
                'user' => $profile->user ? [
                    'id' => $profile->user->id,
                    'name' => $profile->user->name,
                    'email' => $profile->user->email,
                    'is_admin' => (bool) $profile->user->is_admin,
                    'created_at' => $profile->user->created_at,
                ] : null,
            ]);

        $activeArtists = ArtistProfile::query()
            ->whereHas('user');

        $counts = [
            'all' => (clone $activeArtists)->count(),

            'pending' => (clone $activeArtists)
                ->where('verification_status', 'pending')
                ->count(),

            'verified' => (clone $activeArtists)
                ->where('verification_status', 'verified')
                ->count(),

            'rejected' => (clone $activeArtists)
                ->where('verification_status', 'rejected')
                ->count(),
        ];

        return Inertia::render('Admin/Artists/Index', [
            'profiles' => $profiles,
            'filters' => [
                'status' => $status,
                'search' => $search,
                'per_page' => $perPage,
            ],
            'counts' => $counts,
        ]);
    }

    /**
     * Display an individual artist's details.
     */
    public function show(ArtistProfile $profile): Response
    {
        $profile->load('user:id,name,email,is_admin,created_at');

        if (!$profile->user) {
            abort(404);
        }

        $data = [
            'id' => $profile->id,
            'username' => $profile->username,
            'display_name' => $profile->display_name,
            'avatar' => $profile->avatar,
            'avatar_zoom' => $profile->avatar_zoom,
            'avatar_position_x' => $profile->avatar_position_x,
            'avatar_position_y' => $profile->avatar_position_y,
            'bio' => $profile->bio,
            'about_me' => $profile->about_me,
            'artist_type' => $profile->artist_type,
            'location' => $profile->location,
            'website' => $profile->website,
            'verification_status' => $this->verificationStatus($profile),
            'is_published' => (bool) $profile->is_published,
            'created_at' => $profile->created_at,
            'updated_at' => $profile->updated_at,
            'public_url' => $profile->is_published && $profile->username
                ? url('/@' . $profile->username)
                : null,
            'user' => $profile->user ? [
                'id' => $profile->user->id,
                'name' => $profile->user->name,
                'email' => $profile->user->email,
                'is_admin' => (bool) $profile->user->is_admin,
                'created_at' => $profile->user->created_at,
            ] : null,
        ];

        return Inertia::render('Admin/Artists/Show', [
            'profile' => $data,
        ]);
    }
    /**
     * Display the form for managing an artist's account.
     */
    public function edit(ArtistProfile $profile): Response
    {
        $profile->load('user:id,name,email,is_admin');

        if (!$profile->user) {
            abort(404);
        }

        $data = [
            'id' => $profile->id,
            'username' => $profile->username,
            'display_name' => $profile->display_name,
            'verification_status' => $this->verificationStatus($profile),
            'user' => [
                'id' => $profile->user->id,
                'name' => $profile->user->name,
                'email' => $profile->user->email,
                'is_admin' => (bool) $profile->user->is_admin,
            ],
        ];

        return Inertia::render('Admin/Artists/Edit', [
            'profile' => $data,
        ]);
    }



    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'is_admin' => ['required', 'boolean'],
            'verification_status' => [
                'required',
                Rule::in(['pending', 'verified', 'rejected']),
            ],
        ]);

        $profile = ArtistProfile::where('user_id', $user->id)->first();

        if (!$profile) {
            throw ValidationException::withMessages([
                'profile' => 'No artist profile is associated with this account.',
            ]);
        }


        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->is_admin = $validated['is_admin'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();


        $profile->verification_status = $validated['verification_status'];
        $profile->save();

        return redirect()
            ->route('admin.artists.edit', ['profile' => $profile->id])
            ->with('success', 'Artist account updated successfully.');
    }

    /**
     * Return the verification status as a string.
     */
    private function verificationStatus(ArtistProfile $profile): string
    {
        $status = $profile->verification_status;

        return $status instanceof \BackedEnum
            ? (string) $status->value
            : (string) $status;
    }
    /**
     * Soft-delete an artist's user account.
     */
    public function destroy(User $user)
    {
        // Prevent deleting administrator accounts.
        if ($user->is_admin) {
            return back()->withErrors([
                'delete' => 'Administrator accounts cannot be deleted here.',
            ]);
        }

        $profile = ArtistProfile::where('user_id', $user->id)->first();

        // Only allow deletion of accounts belonging to artists.
        if (!$profile) {
            return back()->withErrors([
                'delete' => 'Artist profile not found.',
            ]);
        }

        DB::transaction(function () use ($user, $profile) {
            $profile->is_published = false;
            $profile->save();

            $user->delete();
        });

        return redirect()
            ->route('admin.artists.index')
            ->with('success', 'Artist account deleted successfully.');
    }

}

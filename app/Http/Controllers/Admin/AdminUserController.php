<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'in:10,25,50'],
        ]);

        $search = trim($validated['search'] ?? '');
        $perPage = (int) ($validated['per_page'] ?? 10);

        $users = $this->adminOnlyUsers()
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
            'adminOnlyCount' => $this->adminOnlyUsers()->count(),
            'activeAdminCount' => User::query()->where('is_admin', true)->count(),
            'currentUserId' => $request->user()->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'user' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
            'password' => ['required', 'string', Password::default(), 'confirmed'],
        ]);

        $user = new User([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'email_verified_at' => now(),
        ]);
        $user->is_admin = true;
        $user->save();

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Admin account created successfully.');
    }

    public function edit(User $user): Response
    {
        $this->ensureAdminOnly($user);

        return Inertia::render('Admin/Users/Form', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $this->ensureAdminOnly($user);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (filled($validated['password'] ?? null)) {
            $user->password = $validated['password'];
        }

        $user->save();

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Admin account updated successfully.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->ensureAdminOnly($user);

        if ($request->user()->is($user)) {
            return back()->with('error', 'You cannot delete your own admin account.');
        }

        $deleted = DB::transaction(function () use ($user): bool {
            $activeAdmins = User::query()
                ->where('is_admin', true)
                ->lockForUpdate()
                ->get(['id']);

            if ($activeAdmins->count() <= 1) {
                return false;
            }

            $user->delete();

            return true;
        });

        if (! $deleted) {
            return back()->with('error', 'The last active admin account cannot be deleted.');
        }

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Admin account deleted successfully.');
    }

    private function adminOnlyUsers(): Builder
    {
        return User::query()
            ->where('is_admin', true)
            ->whereDoesntHave('artistProfile');
    }

    private function ensureAdminOnly(User $user): void
    {
        abort_unless(
            $user->is_admin && ! $user->artistProfile()->exists(),
            404,
        );
    }
}

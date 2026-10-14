<?php

namespace App\Http\Controllers;

use App\Actions\Fortify\UpdateUserPassword;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SecurityController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Security/Security', [
            'profile' => $request->user()
                ->artistProfile()
                ->with('socialLinks')
                ->firstOrFail(),
        ]);
    }
    /**
     * Update the authenticated user's password.
     */
    public function updatePassword(Request $request, UpdateUserPassword $updateUserPassword): RedirectResponse
    {
        $updateUserPassword->update(
            $request->user(),
            $request->only(
                'current_password',
                'password',
                'password_confirmation'
            )
        );

        return back()->with(
            'success',
            'Your password has been updated successfully.'
        );
    }
}

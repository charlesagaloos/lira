<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')
            ->with([
                'prompt' => 'select_account',
            ])
            ->redirect();
    }

    public function callback(Request $request)
    {
        $googleUser = Socialite::driver('google')->user();

        $email = $googleUser->getEmail();
        $emailVerified = $googleUser->getRaw()['email_verified'] ?? false;

        if (! is_string($email) || trim($email) === '' || $emailVerified !== true) {
            return redirect()->route('login')->withErrors([
                'email' => 'Google sign-in requires a verified Google email address.',
            ]);
        }

        $socialAccount = SocialAccount::query()
            ->where('provider', 'google')
            ->where('provider_id', $googleUser->getId())
            ->first();

        if ($socialAccount) {
            Auth::login($socialAccount->user, true);

            return redirect()->intended('/dashboard');
        }

        $user = User::query()
            ->where('email', $email)
            ->first();

        if ($user) {
            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'This email is already registered. Please sign in with your password first.',
                ]);
        }

        DB::transaction(function () use ($googleUser, $email, $request, &$user) {
            $user = User::create([
                'name' => $googleUser->getName() ?: $googleUser->getEmail(),
                'email' => $email,
                'password' => Str::random(40),
                'email_verified_at' => now(),
                'registration_ip_address' => $request->ip(),
            ]);

            SocialAccount::create([
                'user_id' => $user->id,
                'provider' => 'google',
                'provider_id' => $googleUser->getId(),
            ]);
        });

        Auth::login($user, true);

        return redirect()->intended('/dashboard');
    }
}

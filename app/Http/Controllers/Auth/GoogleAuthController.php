<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use App\Models\User;
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

    public function callback()
    {
        $googleUser = Socialite::driver('google')
            ->user();

        $socialAccount = SocialAccount::query()
            ->where('provider', 'google')
            ->where('provider_id', $googleUser->getId())
            ->first();

        if ($socialAccount) {
            Auth::login($socialAccount->user, true);

            return redirect()->intended('/dashboard');
        }

        $user = User::query()
            ->where('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'This email is already registered. Please sign in with your password first.',
                ]);
        }

        DB::transaction(function () use ($googleUser, &$user) {
            $user = User::create([
                'name' => $googleUser->getName() ?: $googleUser->getEmail(),
                'email' => $googleUser->getEmail(),
                'password' => Str::random(40),
                'email_verified_at' => now(),
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

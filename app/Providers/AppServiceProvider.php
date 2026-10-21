<?php

namespace App\Providers;

use App\Http\Responses\AdminAwareLoginResponse;
use App\Http\Responses\AdminAwareTwoFactorLoginResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->singleton(LoginResponse::class, AdminAwareLoginResponse::class);
        $this->app->singleton(TwoFactorLoginResponse::class, AdminAwareTwoFactorLoginResponse::class);

        Gate::define('admin', function ($user): bool {
            return $user->is_admin;
        });
    }
}

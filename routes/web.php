<?php

use App\Http\Controllers\ArtistProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/dashboard/profile/create', [ArtistProfileController::class, 'create'])
    ->middleware(['auth', 'verified'])
    ->name('profile.create');

Route::post('/dashboard/profile', [ArtistProfileController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('profile.store');

Route::get('/dashboard/profile', [ArtistProfileController::class, 'edit'])
    ->middleware(['auth', 'verified'])
    ->name('profile.edit');

Route::put('/dashboard/profile', [ArtistProfileController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('profile.update');

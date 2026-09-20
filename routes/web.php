<?php

use App\Http\Controllers\ArtistProfileController;
use App\Http\Controllers\Admin\ArtistVerificationController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PublicPortfolioController;
use App\Http\Controllers\PublicProjectController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PortfolioSettingsController;
use App\Http\Controllers\Auth\GoogleAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])
    ->name('home');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/dashboard/profile/create', [ArtistProfileController::class, 'create'])
    ->middleware(['auth', 'verified'])
    ->name('profile.create');

Route::post('/dashboard/profile', [ArtistProfileController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('profile.store');

Route::get('/dashboard/profile', [ArtistProfileController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('profile.show');

Route::get('/dashboard/profile/edit', [ArtistProfileController::class, 'edit'])
    ->middleware(['auth', 'verified'])
    ->name('profile.edit');

Route::put('/dashboard/profile', [ArtistProfileController::class, 'update'])
    ->middleware(['auth', 'verified'])
    ->name('profile.update');

Route::get('/dashboard/admin', [AdminDashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'admin'])
    ->name('admin.dashboard');

Route::get('/dashboard/admin/verifications', [ArtistVerificationController::class, 'index'])
    ->middleware(['auth', 'verified', 'admin'])
    ->name('admin.verifications.index');

Route::post('/dashboard/admin/verifications/{profile}/verify', [ArtistVerificationController::class, 'verify'])
    ->middleware(['auth', 'verified', 'admin'])
    ->name('admin.verifications.verify');

Route::post('/dashboard/admin/verifications/{profile}/reject', [ArtistVerificationController::class, 'reject'])
    ->middleware(['auth', 'verified', 'admin'])
    ->name('admin.verifications.reject');

Route::post('/dashboard/portfolio/publish', [PortfolioController::class, 'publish'])
    ->middleware(['auth', 'verified', 'verified.artist'])
    ->name('portfolio.publish');

Route::get('/@{username}', [PublicPortfolioController::class, 'show'])
    ->name('portfolio.public');

Route::get('/@{username}/project/{slug}', [PublicProjectController::class, 'show'])
    ->name('portfolio.project');

Route::get('/dashboard/projects', [ProjectController::class, 'index'])
    ->middleware(['auth', 'verified', 'verified.artist'])
    ->name('projects.index');

Route::get('/dashboard/projects/create', [ProjectController::class, 'create'])
    ->middleware(['auth', 'verified', 'verified.artist'])
    ->name('projects.create');

Route::post('/dashboard/projects', [ProjectController::class, 'store'])
    ->middleware(['auth', 'verified', 'verified.artist'])
    ->name('projects.store');

Route::get('/dashboard/projects/{project}/edit', [ProjectController::class, 'edit'])
    ->middleware(['auth', 'verified', 'verified.artist'])
    ->name('projects.edit');

Route::put('/dashboard/projects/{project}', [ProjectController::class, 'update'])
    ->middleware(['auth', 'verified', 'verified.artist'])
    ->name('projects.update');

Route::delete('/dashboard/projects/{project}', [ProjectController::class, 'destroy'])
    ->middleware(['auth', 'verified', 'verified.artist'])
    ->name('projects.destroy');

Route::patch('/dashboard/projects/{project}/visibility', [ProjectController::class, 'toggleVisibility'])
    ->middleware(['auth', 'verified', 'verified.artist'])
    ->name('projects.visibility');

Route::get('/dashboard/portfolio/settings', [PortfolioSettingsController::class, 'edit'])
    ->middleware(['auth', 'verified', 'verified.artist'])
    ->name('portfolio.settings.edit');

Route::put('/dashboard/portfolio/settings', [PortfolioSettingsController::class, 'update'])
    ->middleware(['auth', 'verified', 'verified.artist'])
    ->name('portfolio.settings.update');

Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])
    ->name('auth.google');

Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->name('auth.google.callback');

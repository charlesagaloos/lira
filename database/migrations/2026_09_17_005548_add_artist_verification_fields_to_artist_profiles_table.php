<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('artist_profiles', function (Blueprint $table) {
            $table->string('spotify_artist_url')->nullable();
            $table->string('apple_music_artist_url')->nullable();

            $table->string('verification_status')
                ->default('pending');

            $table->timestamp('verified_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artist_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'spotify_artist_url',
                'apple_music_artist_url',
                'verification_status',
                'verified_at',
            ]);
        });
    }
};

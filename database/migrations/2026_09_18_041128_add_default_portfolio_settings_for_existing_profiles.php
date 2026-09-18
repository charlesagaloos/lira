<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $profiles = DB::table('artist_profiles')
            ->leftJoin(
                'portfolio_settings',
                'artist_profiles.id',
                '=',
                'portfolio_settings.artist_profile_id'
            )
            ->whereNull('portfolio_settings.id')
            ->select('artist_profiles.id')
            ->get();

        foreach ($profiles as $profile) {
            DB::table('portfolio_settings')->insert([
                'artist_profile_id' => $profile->id,
                'template' => 'default',
                'primary_color' => '#ffffff',
                'background_color' => '#09090b',
                'text_color' => '#ffffff',
                'accent_color' => '#a1a1aa',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

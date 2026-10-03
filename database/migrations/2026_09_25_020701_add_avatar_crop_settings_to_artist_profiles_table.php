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
            $table->decimal('avatar_zoom', 5, 2)
                ->default(1.00)
                ->after('avatar');

            $table->decimal('avatar_position_x', 5, 2)
                ->default(50.00)
                ->after('avatar_zoom');

            $table->decimal('avatar_position_y', 5, 2)
                ->default(50.00)
                ->after('avatar_position_x');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artist_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'avatar_zoom',
                'avatar_position_x',
                'avatar_position_y',
            ]);
        });
    }
};

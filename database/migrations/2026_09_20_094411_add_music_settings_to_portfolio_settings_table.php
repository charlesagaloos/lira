<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->boolean('show_music')
                ->default(true)
                ->after('cover_image_offset_y');

            $table->string('music_release_display')
                ->default('latest')
                ->after('show_music');

            $table->unsignedInteger('music_release_limit')
                ->default(6)
                ->after('music_release_display');

            $table->foreignId('featured_release_id')
                ->nullable()
                ->after('music_release_limit')
                ->constrained('releases')
                ->nullOnDelete();

            $table->boolean('show_music_links')
                ->default(true)
                ->after('featured_release_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->dropForeign([
                'featured_release_id',
            ]);

            $table->dropColumn([
                'show_music',
                'music_release_display',
                'music_release_limit',
                'featured_release_id',
                'show_music_links',
            ]);
        });
    }
};

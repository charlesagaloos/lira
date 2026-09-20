<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->string('cover_image')
                ->nullable()
                ->after('card_accent_color');

            $table->decimal('cover_image_position_x', 5, 2)
                ->default(50.00)
                ->after('cover_image');

            $table->decimal('cover_image_position_y', 5, 2)
                ->default(50.00)
                ->after('cover_image_position_x');

            $table->decimal('cover_image_zoom', 5, 2)
                ->default(1.00)
                ->after('cover_image_position_y');

            $table->decimal('cover_image_offset_x', 6, 2)
                ->default(0.00)
                ->after('cover_image_zoom');

            $table->decimal('cover_image_offset_y', 6, 2)
                ->default(0.00)
                ->after('cover_image_offset_x');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->dropColumn([
                'cover_image',
                'cover_image_position_x',
                'cover_image_position_y',
                'cover_image_zoom',
                'cover_image_offset_x',
                'cover_image_offset_y',
            ]);
        });
    }
};

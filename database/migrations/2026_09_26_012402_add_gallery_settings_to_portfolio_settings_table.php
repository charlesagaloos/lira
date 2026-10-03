<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            /* Gallery */

            $table->text('gallery_description')
                ->nullable()
                ->after('gallery_label');

            $table->string('gallery_display')
                ->default('grid')
                ->after('gallery_description');

            $table->unsignedTinyInteger('gallery_columns')
                ->default(3)
                ->after('gallery_display');

            $table->string('gallery_image_aspect')
                ->default('original')
                ->after('gallery_columns');

            $table->boolean('gallery_show_captions')
                ->default(true)
                ->after('gallery_image_aspect');

            $table->boolean('gallery_show_titles')
                ->default(true)
                ->after('gallery_show_captions');

            $table->boolean('gallery_enable_lightbox')
                ->default(true)
                ->after('gallery_show_titles');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->dropColumn([
                'gallery_description',
                'gallery_display',
                'gallery_columns',
                'gallery_image_aspect',
                'gallery_show_captions',
                'gallery_show_titles',
                'gallery_enable_lightbox',
            ]);
        });
    }
};

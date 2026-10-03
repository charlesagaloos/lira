<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            /*
            |--------------------------------------------------------------------------
            | Global Color System
            |--------------------------------------------------------------------------
            */

            $table->string('hover_color', 7)
                ->default('#ffffff')
                ->after('accent_color');

            $table->string('surface_color', 7)
                ->default('#0d0f12')
                ->after('background_color');

            $table->string('muted_text_color', 7)
                ->default('#8a8f98')
                ->after('text_color');

            $table->string('border_color', 7)
                ->default('#ffffff')
                ->after('muted_text_color');

            /*
            |--------------------------------------------------------------------------
            | Hero
            |--------------------------------------------------------------------------
            */

            $table->boolean('show_hero')
                ->default(true)
                ->after('cover_image_offset_y');

            $table->string('hero_label')
                ->nullable()
                ->after('show_hero');

            $table->text('hero_statement')
                ->nullable()
                ->after('hero_label');

            /*
            |--------------------------------------------------------------------------
            | Work / Projects
            |--------------------------------------------------------------------------
            */

            $table->boolean('show_work')
                ->default(true)
                ->after('hero_statement');

            $table->string('work_label')
                ->nullable()
                ->after('show_work');

            $table->text('work_description')
                ->nullable()
                ->after('work_label');

            /*
            |--------------------------------------------------------------------------
            | About
            |--------------------------------------------------------------------------
            */

            $table->boolean('show_about')
                ->default(true)
                ->after('work_description');

            $table->string('about_label')
                ->nullable()
                ->after('show_about');

            /*
            |--------------------------------------------------------------------------
            | Artist Message / Motto
            |--------------------------------------------------------------------------
            */

            $table->boolean('show_artist_message')
                ->default(false)
                ->after('about_label');

            $table->string('artist_message_label')
                ->nullable()
                ->after('show_artist_message');

            $table->text('artist_message')
                ->nullable()
                ->after('artist_message_label');

            /*
            |--------------------------------------------------------------------------
            | Gallery
            |--------------------------------------------------------------------------
            */

            $table->boolean('show_gallery')
                ->default(false)
                ->after('artist_message');

            $table->string('gallery_label')
                ->nullable()
                ->after('show_gallery');

            /*
            |--------------------------------------------------------------------------
            | Music
            |--------------------------------------------------------------------------
            */

            $table->string('music_label')
                ->nullable()
                ->after('show_music');

            /*
            |--------------------------------------------------------------------------
            | Navigation
            |--------------------------------------------------------------------------
            */

            $table->boolean('show_navigation')
                ->default(true)
                ->after('music_label');

            /*
            |--------------------------------------------------------------------------
            | Footer
            |--------------------------------------------------------------------------
            */

            $table->boolean('show_footer')
                ->default(true)
                ->after('show_navigation');

            $table->string('footer_label')
                ->nullable()
                ->after('show_footer');

            $table->text('footer_message')
                ->nullable()
                ->after('footer_label');

            $table->boolean('show_footer_socials')
                ->default(true)
                ->after('footer_message');

            $table->string('footer_logo')
                ->nullable()
                ->after('show_footer_socials');

            $table->string('copyright_text')
                ->nullable()
                ->after('footer_logo');

            $table->boolean('show_powered_by_lira')
                ->default(true)
                ->after('copyright_text');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->dropColumn([
                'hover_color',
                'surface_color',
                'muted_text_color',
                'border_color',

                'show_hero',
                'hero_label',
                'hero_statement',

                'show_work',
                'work_label',
                'work_description',

                'show_about',
                'about_label',

                'show_artist_message',
                'artist_message_label',
                'artist_message',

                'show_gallery',
                'gallery_label',

                'music_label',

                'show_navigation',

                'show_footer',
                'footer_label',
                'footer_message',
                'show_footer_socials',
                'footer_logo',
                'copyright_text',
                'show_powered_by_lira',
            ]);
        });
    }
};

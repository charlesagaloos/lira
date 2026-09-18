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
            $table->string('card_background_color')
                ->default('#18181b')
                ->after('accent_color');

            $table->string('card_text_color')
                ->default('#d4d4d8')
                ->after('card_background_color');

            $table->string('card_accent_color')
                ->default('#ffffff')
                ->after('card_text_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->dropColumn([
                'card_background_color',
                'card_text_color',
                'card_accent_color',
            ]);
        });
    }
};

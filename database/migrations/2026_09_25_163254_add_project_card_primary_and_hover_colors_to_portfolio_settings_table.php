<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->string('card_primary_color', 7)
                ->default('#ffffff')
                ->after('card_accent_color');

            $table->string('card_hover_color', 7)
                ->default('#ffffff')
                ->after('card_primary_color');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->dropColumn([
                'card_primary_color',
                'card_hover_color',
            ]);
        });
    }
};

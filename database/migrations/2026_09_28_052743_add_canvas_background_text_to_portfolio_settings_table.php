<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->text('canvas_background_text')
                ->nullable()
                ->after('artist_message');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->dropColumn('canvas_background_text');
        });
    }
};

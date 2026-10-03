<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->json('gallery_responsive')
                ->nullable()
                ->after('gallery_enable_lightbox');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_settings', function (Blueprint $table) {
            $table->dropColumn('gallery_responsive');
        });
    }
};

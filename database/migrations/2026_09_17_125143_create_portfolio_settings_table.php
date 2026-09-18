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
        Schema::create('portfolio_settings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('artist_profile_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->string('template')->default('default');

            $table->string('primary_color')->default('#ffffff');
            $table->string('background_color')->default('#09090b');
            $table->string('text_color')->default('#ffffff');
            $table->string('accent_color')->default('#a1a1aa');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_settings');
    }
};

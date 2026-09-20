<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artist_social_links', function (Blueprint $table) {
            $table->id();

            $table->foreignId('artist_profile_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('platform', 50);
            $table->string('url', 2048);
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_visible')->default(true);

            $table->timestamps();

            $table->unique(
                ['artist_profile_id', 'platform'],
                'artist_social_links_profile_platform_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artist_social_links');
    }
};

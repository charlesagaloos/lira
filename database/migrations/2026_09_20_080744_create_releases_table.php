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
        Schema::create('releases', function (Blueprint $table) {
            $table->id();

            $table->foreignId('artist_profile_id')
                ->constrained('artist_profiles')
                ->cascadeOnDelete();

            $table->string('title');
            $table->string('release_type')->default('single');

            $table->string('artwork')->nullable();

            $table->date('release_date')->nullable();

            $table->text('description')->nullable();

            $table->string('spotify_url')->nullable();
            $table->string('apple_music_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('soundcloud_url')->nullable();
            $table->string('bandcamp_url')->nullable();

            $table->longText('lyrics')->nullable();

            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_visible')->default(true);

            $table->timestamps();

            $table->index([
                'artist_profile_id',
                'is_visible',
                'position',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('releases');
    }
};

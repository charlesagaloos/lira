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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            $table->foreignId('artist_profile_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('project_type')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('url')->nullable();

            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_visible')->default(true);

            $table->timestamps();

            $table->unique(['artist_profile_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

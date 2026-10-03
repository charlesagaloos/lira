<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('portfolio_gallery_images', function (Blueprint $table) {
            $table->id();

            $table->foreignId('portfolio_setting_id')
                ->constrained('portfolio_settings')
                ->cascadeOnDelete();

            $table->string('image');

            $table->string('title')
                ->nullable();

            $table->text('caption')
                ->nullable();

            $table->string('alt_text')
                ->nullable();

            $table->unsignedInteger('sort_order')
                ->default(0);

            $table->timestamps();

            $table->index([
                'portfolio_setting_id',
                'sort_order',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_gallery_images');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('portfolio_navigation_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('portfolio_setting_id')
                ->constrained('portfolio_settings')
                ->cascadeOnDelete();

            $table->string('label');

            $table->string('destination');

            $table->string('url')
                ->nullable();

            $table->unsignedInteger('sort_order')
                ->default(0);

            $table->boolean('is_visible')
                ->default(true);

            $table->timestamps();

            $table->index([
                'portfolio_setting_id',
                'sort_order',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_navigation_items');
    }
};

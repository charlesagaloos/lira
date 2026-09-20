<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_views', function (Blueprint $table) {
            $table->id();

            $table
                ->foreignId('artist_profile_id')
                ->constrained('artist_profiles')
                ->cascadeOnDelete();

            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamp('viewed_at')->useCurrent();

            $table->timestamps();

            $table->index([
                'artist_profile_id',
                'viewed_at',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_views');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('language');
            $table->json('completed_topics')->nullable();
            $table->string('selected_path_id')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'language']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_progress');
    }
};

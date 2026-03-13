<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roadmap_paths', function (Blueprint $table) {
            $table->id();
            $table->string('language');
            $table->string('path_id');
            $table->json('data');
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();
            $table->unique(['language', 'path_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roadmap_paths');
    }
};

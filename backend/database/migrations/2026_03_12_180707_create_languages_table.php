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
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('sym', 10);
            $table->string('name');
            $table->string('cat');
            $table->smallInteger('year');
            $table->string('paradigm');
            $table->text('desc');
            $table->json('links')->nullable();
            $table->json('tutorials')->nullable();
            $table->json('frameworks')->nullable();
            $table->json('tools')->nullable();
            $table->json('packages')->nullable();
            $table->json('package_manager')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};

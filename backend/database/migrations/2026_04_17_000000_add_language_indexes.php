<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('languages', function (Blueprint $table) {
            $table->index('name');
        });

        Schema::table('roadmaps', function (Blueprint $table) {
            $table->index('language');
        });

        Schema::table('roadmap_paths', function (Blueprint $table) {
            $table->index('language');
        });
    }

    public function down(): void
    {
        Schema::table('languages', function (Blueprint $table) {
            $table->dropIndex(['name']);
        });

        Schema::table('roadmaps', function (Blueprint $table) {
            $table->dropIndex(['language']);
        });

        Schema::table('roadmap_paths', function (Blueprint $table) {
            $table->dropIndex(['language']);
        });
    }
};

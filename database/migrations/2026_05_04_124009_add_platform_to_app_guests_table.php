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
        Schema::table('app_guests', function (Blueprint $table) {
            // Menggunakan enum untuk membatasi pilihan
            $table->enum('platform', ['Agoda', 'RedDoorz', 'Traveloka', 'Other'])
                ->default('Other') // Opsional: memberikan nilai default
                ->after('status'); 
        });
    }

    public function down(): void
    {
        Schema::table('app_guests', function (Blueprint $table) {
            $table->dropColumn('platform');
        });
    }
};

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
            // Mengubah kolom yang salah tadi menjadi enum yang bersih
            $table->enum('platform', ['Agoda', 'RedDoorz', 'Traveloka', 'Other'])
                ->default('Other')
                ->change(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('app_guests', function (Blueprint $table) {
            //
        });
    }
};

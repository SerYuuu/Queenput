<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembukuan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');                     // Nama buku custom
            $table->tinyInteger('month');               // 1-12
            $table->smallInteger('year');               // e.g. 2024
            $table->enum('status', ['aktif', 'selesai'])->default('aktif');
            $table->text('catatan')->nullable();        // Catatan/deskripsi opsional
            $table->timestamps();

            // Satu user hanya boleh punya satu buku per bulan-tahun
            $table->unique(['user_id', 'month', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembukuan');
    }
};
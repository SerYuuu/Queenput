<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tambah kolom role ke tabel users
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['owner', 'admin'])->default('admin')->after('email');
        });
        // 2. Tabel untuk Tamu Reguler (dengan kolom uang)
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            // Tambahkan kolom identitas buku (agar data tidak masuk ke buku lama)
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('month');
            $table->smallInteger('year');

            $table->string('nomor_kamar', 20)->nullable();
            $table->string('nama_tamu');
            $table->string('tanggal_checkin', 20)->nullable();
            $table->string('tanggal_checkout', 20)->nullable();
            $table->bigInteger('total_bayar')->default(0);
            
            // KOLOM YANG HILANG (Penyebab Error):
            $table->string('shift_admin')->nullable(); 
            $table->string('tanggal_input')->nullable();
            $table->enum('status', ['checkin', 'checkout'])->default('checkin');

            $table->string('alamat')->nullable();
            $table->string('nik', 20)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // Tabel untuk Tamu Aplikasi/OTA (Tanpa Kolom Uang)
       Schema::create('app_guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('month');
            $table->smallInteger('year');
            
            $table->string('nomor_kamar', 20)->nullable();
            $table->string('nama_tamu');
            $table->string('tanggal_checkin', 20)->nullable();
            $table->string('tanggal_checkout', 20)->nullable();
            
            // TAMBAHKAN DUA KOLOM INI:
            $table->string('prepaid')->nullable(); 
            $table->string('pah')->nullable();
            
            $table->string('shift_admin')->nullable(); 
            $table->string('tanggal_input')->nullable();
            $table->enum('status', ['checkin', 'checkout'])->default('checkin');
            
            $table->string('alamat')->nullable();
            $table->string('nik', 20)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 3. Audit log — untuk mencatat aktivitas
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('action');           // created | updated | deleted
            $table->string('model');            // AppGuest
            $table->unsignedBigInteger('model_id');
            $table->string('field')->nullable();
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('hash', 64)->nullable();
            $table->string('prev_hash', 64)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('app_guests');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
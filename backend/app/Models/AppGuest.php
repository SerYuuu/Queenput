<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Tambahkan ini
class AppGuest extends Model
{
    protected $table = 'app_guests';
    use HasFactory; // Dan in
   protected $fillable = [
        'nomor_kamar',
        'nama_tamu',
        'platform',
        'tanggal_checkin',
        'tanggal_checkout',
        'prepaid',     // Tambahkan ini
        'pah',         // Tambahkan ini
        'alamat',
        'nik',
        'keterangan',
        'shift_admin',   // Pastikan ini juga ada jika dipakai
        'tanggal_input',
        'status'   ,      // Tambahkan ini
    ];


}
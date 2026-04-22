<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Observers\GuestObserver;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Tambahkan ini
class Guest extends Model
{
    // app/Models/Guest.php
    protected $fillable = [
        'user_id', 'month', 'year', 'nomor_kamar', 'nama_tamu', 
        'tanggal_checkin', 'tanggal_checkout', 'total_bayar', 
        'shift_admin', 'tanggal_input', 'status', 'alamat', 'nik', 'keterangan'
    ];
    use HasFactory; // Dan in
    protected $casts = [
        'total_bayar' => 'integer',
    ];

    protected static function booted(): void
    {
        static::observe(GuestObserver::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Observers\AppGuestObserver;

class AppGuest extends Model
{
    use HasFactory;

    protected $table = 'app_guests';

    protected $fillable = [
        'user_id', 'month', 'year', // ← tambahkan ini
        'nomor_kamar', 'nama_tamu', 'platform',
        'tanggal_checkin', 'tanggal_checkout',
        'prepaid', 'pah', 'alamat', 'nik', 'keterangan',
        'shift_admin', 'tanggal_input', 'status',
        'created_at', 'updated_at','platform' // ← tambahkan ini
    ];

    
}
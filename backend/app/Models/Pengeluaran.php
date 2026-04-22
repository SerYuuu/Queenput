<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengeluaran extends Model
{
    protected $fillable = ['nama_barang', 'harga', 'keterangan', 'shift_admin', 'tanggal_input'];
}

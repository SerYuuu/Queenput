<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Tambahkan ini
use Carbon\Carbon;

class PengeluaranController extends Controller
{
        public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_barang'   => 'required|string',
            'harga'         => 'required|string',
            'keterangan'    => 'nullable|string',
            'shift_admin'   => 'required|string',
            'tanggal_input' => 'required|string',
            'month'         => 'required|integer', // Tangkap bulan buku
            'year'          => 'required|integer',  // Tangkap tahun buku
        ]);

        DB::table('pengeluarans')->insert([
            'user_id'       => auth()->id(), // Simpan ID user yang login
            'nama_barang'   => $validated['nama_barang'],
            'harga'         => (string)$validated['harga'], // Paksa jadi integer agar tidak .00            'keterangan'    => $validated['keterangan'],
            'shift_admin'   => $validated['shift_admin'],
            'tanggal_input' => $validated['tanggal_input'],
            'month'         => $validated['month'], // Simpan bulan buku
            'year'          => $validated['year'],  // Simpan tahun buku
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        return back()->with('message', 'Pengeluaran berhasil disimpan.');
    }
}
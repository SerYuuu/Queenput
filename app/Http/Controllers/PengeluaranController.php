<?php

namespace App\Http\Controllers;

use App\Models\Pengeluaran;
use Illuminate\Http\Request;

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
            'month'         => 'required|integer',
            'year'          => 'required|integer',
        ]);

        Pengeluaran::create([
            'user_id'       => auth()->id(),
            'nama_barang'   => $validated['nama_barang'],
            'harga'         => (int) $validated['harga'],
            'keterangan'    => $validated['keterangan'],
            'shift_admin'   => $validated['shift_admin'],
            'tanggal_input' => $validated['tanggal_input'],
            'month'         => $validated['month'],
            'year'          => $validated['year'],
        ]);

        return back()->with('message', 'Pengeluaran berhasil disimpan.');
    }
}
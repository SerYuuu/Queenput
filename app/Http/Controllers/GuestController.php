<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\AppGuest;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuestController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year  = $request->input('year', now()->year);

        $guests = Guest::whereMonth('created_at', $month)
                    ->whereYear('created_at', $year)
                    ->orderBy('created_at', 'asc')
                    ->get();

        $appGuests = AppGuest::whereMonth('created_at', $month)
                    ->whereYear('created_at', $year)
                    ->orderBy('created_at', 'asc')
                    ->get();

        $expenses = Pengeluaran::whereMonth('created_at', $month)
                    ->whereYear('created_at', $year)
                    ->orderBy('created_at', 'asc')
                    ->get();

        return Inertia::render('Guest/Index', [
            'guests'        => $guests,
            'appGuests'     => $appGuests,
            'expenses'      => $expenses,
            'selectedMonth' => (int)$month,
            'selectedYear'  => (int)$year,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_kamar'      => 'nullable|string|max:20',
            'nama_tamu'        => 'required|string|max:255',
            'tanggal_checkin'  => 'nullable|string|max:20',
            'tanggal_checkout' => 'nullable|string|max:20',
            'total_bayar'      => 'required|integer|min:0',
            'alamat'           => 'nullable|string|max:255',
            'nik'              => 'nullable|string|max:20',
            'keterangan'       => 'nullable|string',
            'month'            => 'required|integer',
            'year'             => 'required|integer',
            'shift_admin'      => 'required|string',
            'tanggal_input'    => 'required|string',
        ]);

        $date = \Carbon\Carbon::create(
            (int) $validated['year'],
            (int) $validated['month'],
            1, 12, 0, 0
        )->toDateTimeString();

        // ✅ Pakai Eloquent create() agar observer terpanggil
        Guest::withoutTimestamps(function () use ($validated, $date) {
            Guest::create([
                'user_id'          => auth()->id(),
                'month'            => $validated['month'],
                'year'             => $validated['year'],
                'nomor_kamar'      => $validated['nomor_kamar'],
                'nama_tamu'        => $validated['nama_tamu'],
                'tanggal_checkin'  => $validated['tanggal_checkin'],
                'tanggal_checkout' => $validated['tanggal_checkout'],
                'total_bayar'      => $validated['total_bayar'],
                'alamat'           => $validated['alamat'],
                'nik'              => $validated['nik'],
                'keterangan'       => $validated['keterangan'],
                'shift_admin'      => $validated['shift_admin'],
                'tanggal_input'    => $validated['tanggal_input'],
                'status'           => 'checkin',
                'created_at'       => $date,
                'updated_at'       => $date,
            ]);
        });

        return redirect()->back()->with('message', 'Data tamu reguler berhasil disimpan.');
    }

    public function update(Request $request, Guest $guest)
    {
        $validated = $request->validate([
            'nomor_kamar'      => 'nullable|string|max:20',
            'nama_tamu'        => 'nullable|string|max:255',
            'tanggal_checkin'  => 'nullable|string|max:20',
            'tanggal_checkout' => 'nullable|string|max:20',
            'total_bayar'      => 'nullable|integer|min:0',
            'alamat'           => 'nullable|string|max:255',
            'nik'              => 'nullable|string|max:20',
            'keterangan'       => 'nullable|string',
        ]);

        $guest->update($validated);
        return redirect()->back();
    }

    public function updateStatus(Request $request, Guest $guest)
    {
        $request->validate([
            'status' => 'required|in:checkin,checkout',
        ]);

        $guest->update(['status' => $request->status]);
        return redirect()->back();
    }

    public function destroy(Guest $guest)
    {
        $guest->delete();
        return redirect()->back();
    }
}
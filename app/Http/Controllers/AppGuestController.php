<?php

namespace App\Http\Controllers;

use App\Models\AppGuest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppGuestController extends Controller
{
    public function index()
    {
        $guests = AppGuest::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Guest/Index', [
            'guests' => $guests,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_kamar'      => 'nullable|string|max:20',
            'nama_tamu'        => 'required|string|max:255',
            'tanggal_checkin'  => 'nullable|string|max:20',
            'tanggal_checkout' => 'nullable|string|max:20',
            'alamat'           => 'nullable|string|max:255',
            'nik'              => 'nullable|string|max:20',
            'keterangan'       => 'nullable|string',
            'month'            => 'required|integer',
            'year'             => 'required|integer',
            'shift_admin'      => 'required|string',
            'tanggal_input'    => 'required|string',
            'prepaid'          => 'nullable|string|max:255',
            'pah'              => 'nullable|string|max:255',
            'platform'         => 'required|in:Agoda,RedDoorz,Traveloka,Other',  
            ]);

        
        $date = \Carbon\Carbon::create(
            (int) $validated['year'],
            (int) $validated['month'],
            1, 12, 0, 0
        )->toDateTimeString();

        AppGuest::withoutTimestamps(function () use ($validated, $date) {
            AppGuest::create([
                'user_id'          => auth()->id(),
                'month'            => $validated['month'],
                'year'             => $validated['year'],
                'nomor_kamar'      => $validated['nomor_kamar'],
                'nama_tamu'        => $validated['nama_tamu'],
                'tanggal_checkin'  => $validated['tanggal_checkin'],
                'tanggal_checkout' => $validated['tanggal_checkout'],
                'alamat'           => $validated['alamat'],
                'nik'              => $validated['nik'],
                'keterangan'       => $validated['keterangan'],
                'shift_admin'      => $validated['shift_admin'],
                'tanggal_input'    => $validated['tanggal_input'],
                'prepaid'          => $validated['prepaid'],
                'pah'              => $validated['pah'],
                'platform'         => $validated['platform'],
                'status'           => 'checkin',
                'created_at'       => $date,
                'updated_at'       => $date,
            ]);
        });

        return redirect()->back()->with('message', 'Data OTA berhasil ditambahkan.');
    }

    public function updateStatus(Request $request, AppGuest $appGuest)
    {
        // FIX: Ganti cek auth()->id() !== 1 (hardcode!) dengan cek role
        abort_unless(
            $appGuest->user_id === auth()->id() || auth()->user()->role === 'owner',
            403
        );

        $request->validate([
            'status' => 'required|in:checkin,checkout',
        ]);

        $appGuest->update(['status' => $request->status]);
        return redirect()->back();
    }

    public function update(Request $request, AppGuest $appGuest)
    {
        abort_if($appGuest->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'nomor_kamar'      => 'nullable|string|max:20',
            'nama_tamu'        => 'nullable|string|max:255',
            'tanggal_checkin'  => 'nullable|string|max:20',
            'tanggal_checkout' => 'nullable|string|max:20',
            'alamat'           => 'nullable|string|max:255',
            'nik'              => 'nullable|string|max:20',
            'keterangan'       => 'nullable|string',
            'prepaid'          => 'nullable|string|max:255',
            'pah'              => 'nullable|string|max:255',
            'platform'         => 'nullable|in:Agoda,RedDoorz,Traveloka,Other',
        ]);

        $appGuest->update($validated);
        return redirect()->back();
    }

    public function destroy(AppGuest $appGuest)
    {
        abort_if($appGuest->user_id !== auth()->id(), 403);

        $appGuest->delete();
        return redirect()->back();
    }
}
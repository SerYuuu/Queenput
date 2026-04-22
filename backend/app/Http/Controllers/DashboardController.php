<?php

namespace App\Http\Controllers;

use App\Models\Pembukuan;
use App\Models\Guest;
use App\Models\AppGuest;
use App\Models\Pengeluaran;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // Ambil semua buku milik user dari tabel pembukuan
        $files = Pembukuan::where('user_id', $userId)
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->get()
            ->map(fn($p) => $this->formatFromModel($p));

        // Pastikan bulan sekarang selalu muncul
        $now = now();
        $currentExists = Pembukuan::where('user_id', $userId)
            ->where('month', $now->month)
            ->where('year', $now->year)
            ->exists();

        return Inertia::render('Dashboard', [
            'files'        => $files,
            'currentMonth' => $now->month,
            'currentYear'  => $now->year,
        ]);
    }

    /**
     * Simpan buku baru ke tabel pembukuan, lalu redirect ke guest.index
     */
    public function createFile(Request $request)
    {
        $request->validate([
            'month'   => 'required|integer|min:1|max:12',
            'year'    => 'required|integer|min:2020|max:2099',
            'name'    => 'nullable|string|max:100',
            'catatan' => 'nullable|string|max:500',
            'status'  => 'nullable|in:aktif,selesai',
        ]);

        $month = $request->month;
        $year  = $request->year;
        $date  = Carbon::create($year, $month, 1);

        // Nama default jika tidak diisi
        $name = $request->filled('name')
            ? $request->name
            : 'Pembukuan_' . $date->translatedFormat('F') . "_{$year}";

        // Cegah duplikat (bulan+tahun yang sama untuk user ini)
        $exists = Pembukuan::where('user_id', Auth::id())
            ->where('month', $month)
            ->where('year', $year)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'month' => "Buku untuk {$date->translatedFormat('F')} {$year} sudah ada.",
            ]);
        }

        Pembukuan::create([
            'user_id' => Auth::id(),
            'name'    => $name,
            'month'   => $month,
            'year'    => $year,
            'status'  => $request->input('status', 'aktif'),
            'catatan' => $request->input('catatan'),
        ]);

        return redirect()->route('dashboard')->with('message', 'Buku berhasil dibuat.');
    }

    /**
     * Update nama dan catatan buku
     */
    public function updateFile(Request $request, Pembukuan $pembukuan)
    {
        $this->authorize('update', $pembukuan); // opsional, atau cek manual:
        // abort_if($pembukuan->user_id !== Auth::id(), 403);

        $request->validate([
            'name'    => 'required|string|max:100',
            'catatan' => 'nullable|string|max:500',
            'status'  => 'nullable|in:aktif,selesai',
        ]);

        $pembukuan->update($request->only('name', 'catatan', 'status'));

        return redirect()->route('dashboard')->with('message', 'Buku berhasil diperbarui.');
    }

    /**
     * Hapus buku beserta seluruh data transaksinya
     */
    public function deleteFile(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year'  => 'required|integer|min:2020|max:2099',
        ]);

        $month  = $request->month;
        $year   = $request->year;
        $userId = Auth::id();

        DB::transaction(function () use ($month, $year, $userId) {
            // Hapus record pembukuan
            Pembukuan::where('user_id', $userId)
                ->where('month', $month)
                ->where('year', $year)
                ->delete();

            // Hapus semua transaksi bulan tersebut
            Guest::whereMonth('created_at', $month)->whereYear('created_at', $year)->delete();
            AppGuest::whereMonth('created_at', $month)->whereYear('created_at', $year)->delete();
            Pengeluaran::whereMonth('created_at', $month)->whereYear('created_at', $year)->delete();
        });

        return redirect()->route('dashboard')->with('message', 'Buku berhasil dihapus.');
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private function formatFromModel(Pembukuan $p): array
    {
        return [
            'id'       => $p->id,                      // integer ID nyata dari DB
            'slug'     => "{$p->year}-{$p->month}",   // untuk keperluan warna/referensi
            'name'     => $p->name,
            'month'    => $p->month,
            'year'     => $p->year,
            'owner'    => $p->user->name ?? 'saya',
            'status'   => $p->status,
            'catatan'  => $p->catatan,
            'is_empty' => false,                       // field pembukuan sudah pasti ada datanya
        ];
    }
}
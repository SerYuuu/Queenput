<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\AppGuest;
use App\Models\Pengeluaran; // Tambahkan ini
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardKeuanganController extends Controller
{
    public function index()
    {
        $now       = now();
        $thisMonth = $now->month;
        $thisYear  = $now->year;
        $todayStr  = $now->format('Y-m-d');
        $lastMonthDate = $now->copy()->subMonth();

        // ── STATS HARI INI ──
        $todayGuests = Guest::where('tanggal_input', $todayStr)->count()
                     + AppGuest::where('tanggal_input', $todayStr)->count();

        // Revenue Gabungan: Reguler + OTA (Prepaid + PAH)
        $todayRevenue = Guest::where('tanggal_input', $todayStr)->sum('total_bayar')
                      + AppGuest::where('tanggal_input', $todayStr)->sum(DB::raw('prepaid + pah'));

        // Pengeluaran Hari Ini
        $todayExpense = Pengeluaran::where('tanggal_input', $todayStr)->sum('harga');

        // ── STATS BULANAN ──
        $guestThisMonth = Guest::where('month', $thisMonth)->where('year', $thisYear)->count()
                        + AppGuest::where('month', $thisMonth)->where('year', $thisYear)->count();

        $guestLastMonth = Guest::where('month', $lastMonthDate->month)->where('year', $lastMonthDate->year)->count()
                        + AppGuest::where('month', $lastMonthDate->month)->where('year', $lastMonthDate->year)->count();

        // Revenue Bulanan Gabungan
        $revenueThisMonth = Guest::where('month', $thisMonth)->where('year', $thisYear)->sum('total_bayar')
                          + AppGuest::where('month', $thisMonth)->where('year', $thisYear)->sum(DB::raw('prepaid + pah'));

        $revenueLastMonth = Guest::where('month', $lastMonthDate->month)->where('year', $lastMonthDate->year)->sum('total_bayar')
                          + AppGuest::where('month', $lastMonthDate->month)->where('year', $lastMonthDate->year)->sum(DB::raw('prepaid + pah'));

        // Pengeluaran Bulanan
        $expenseThisMonth = Pengeluaran::where('month', $thisMonth)->where('year', $thisYear)->sum('harga');

        // ── GRAFIK MINGGUAN (4 Minggu Terakhir) ──
        $weeklyGuests = collect(range(3, 0))->map(function ($weeksAgo) use ($thisMonth, $thisYear) {
            $start = now()->startOfWeek()->subWeeks($weeksAgo);
            $end   = $start->copy()->endOfWeek();
            $label = $start->format('d/m');

            // Gunakan created_at untuk grafik waktu agar presisi secara kalender
            $count = Guest::whereBetween('created_at', [$start, $end])->count()
                   + AppGuest::whereBetween('created_at', [$start, $end])->count();

            $revenue = Guest::whereBetween('created_at', [$start, $end])->sum('total_bayar')
                     + AppGuest::whereBetween('created_at', [$start, $end])->sum(DB::raw('prepaid + pah'));

            return [
                'label'   => 'Mgg ' . $label,
                'count'   => (int)$count,
                'revenue' => (int)$revenue
            ];
        });

        // ── GRAFIK BULANAN (6 Bulan Terakhir) ──
        $monthlyData = collect(range(5, 0))->map(function ($monthsAgo) {
            $date  = now()->subMonths($monthsAgo);
            $m     = $date->month;
            $y     = $date->year;
            $label = $date->translatedFormat('M');

            $count = Guest::where('month', $m)->whereYear('year', $y)->count()
                   + AppGuest::where('month', $m)->whereYear('year', $y)->count();

            $revenue = Guest::where('month', $m)->whereYear('year', $y)->sum('total_bayar')
                     + AppGuest::where('month', $m)->whereYear('year', $y)->sum(DB::raw('prepaid + pah'));

            return [
                'label'   => $label,
                'count'   => (int)$count,
                'revenue' => (int)$revenue
            ];
        });

        return Inertia::render('DashboardKeuangan', [
            'stats' => [
                'todayGuests'      => $todayGuests,
                'todayRevenue'     => (int)$todayRevenue,
                'todayExpense'     => (int)$todayExpense,
                'guestThisMonth'   => $guestThisMonth,
                'guestLastMonth'   => $guestLastMonth,
                'guestGrowth'      => $guestLastMonth > 0 ? round((($guestThisMonth - $guestLastMonth) / $guestLastMonth) * 100, 1) : 0,
                'revenueThisMonth' => (int)$revenueThisMonth,
                'revenueLastMonth' => (int)$revenueLastMonth,
                'revenueGrowth'    => $revenueLastMonth > 0 ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 1) : 0,
                'monthExpense'     => (int)$expenseThisMonth,
            ],
            'weeklyGuests' => $weeklyGuests,
            'monthlyData'  => $monthlyData,
        ]);
    }
}
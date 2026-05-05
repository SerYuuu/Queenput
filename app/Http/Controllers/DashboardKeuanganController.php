<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\AppGuest;
use App\Models\Pengeluaran;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardKeuanganController extends Controller
{
    public function index()
    {
        $now           = now();
        $thisMonth     = $now->month;
        $thisYear      = $now->year;
        $todayStr      = $now->format('Y-m-d');
        $lastMonthDate = $now->copy()->subMonth();

        // ── STATS HARI INI ────────────────────────────────────────────────────

        $todayGuests = Guest::where('tanggal_input', $todayStr)->count()
                     + AppGuest::where('tanggal_input', $todayStr)->count();

        $todayRevenue = Guest::where('tanggal_input', $todayStr)->sum('total_bayar')
                      + AppGuest::where('tanggal_input', $todayStr)->sum(DB::raw('prepaid + pah'));

        $todayExpense = Pengeluaran::where('tanggal_input', $todayStr)->sum('harga');

        // ── STATS TAMU BULANAN ────────────────────────────────────────────────

        $guestThisMonth = Guest::where('month', $thisMonth)->where('year', $thisYear)->count()
                        + AppGuest::where('month', $thisMonth)->where('year', $thisYear)->count();

        $guestLastMonth = Guest::where('month', $lastMonthDate->month)->where('year', $lastMonthDate->year)->count()
                        + AppGuest::where('month', $lastMonthDate->month)->where('year', $lastMonthDate->year)->count();

        $guestGrowth = $guestLastMonth > 0
            ? round((($guestThisMonth - $guestLastMonth) / $guestLastMonth) * 100, 1)
            : null;

        // ── REVENUE BULANAN ───────────────────────────────────────────────────

        $revenueThisMonth = Guest::where('month', $thisMonth)->where('year', $thisYear)->sum('total_bayar')
                          + AppGuest::where('month', $thisMonth)->where('year', $thisYear)->sum(DB::raw('prepaid + pah'));

        $revenueLastMonth = Guest::where('month', $lastMonthDate->month)->where('year', $lastMonthDate->year)->sum('total_bayar')
                          + AppGuest::where('month', $lastMonthDate->month)->where('year', $lastMonthDate->year)->sum(DB::raw('prepaid + pah'));

        $revenueGrowth = $revenueLastMonth > 0
            ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 1)
            : null;

        // ── PENGELUARAN BULANAN ───────────────────────────────────────────────

        $expenseThisMonth = Pengeluaran::where('month', $thisMonth)->where('year', $thisYear)->sum('harga');

        $expenseLastMonth = Pengeluaran::where('month', $lastMonthDate->month)->where('year', $lastMonthDate->year)->sum('harga');

        $expenseGrowth = $expenseLastMonth > 0
            ? round((($expenseThisMonth - $expenseLastMonth) / $expenseLastMonth) * 100, 1)
            : null;

        // ── LABA BERSIH BULANAN ───────────────────────────────────────────────

        $profitThisMonth = $revenueThisMonth - $expenseThisMonth;
        $profitLastMonth = $revenueLastMonth - $expenseLastMonth;

        $profitGrowth = $profitLastMonth > 0
            ? round((($profitThisMonth - $profitLastMonth) / $profitLastMonth) * 100, 1)
            : null;

        // ── GRAFIK MINGGUAN (4 Minggu Terakhir) ──────────────────────────────

        $weeklyGuests = collect(range(3, 0))->map(function ($weeksAgo) {
            $start = now()->startOfWeek()->subWeeks($weeksAgo);
            $end   = $start->copy()->endOfWeek();

            $count = Guest::whereBetween('created_at', [$start, $end])->count()
                   + AppGuest::whereBetween('created_at', [$start, $end])->count();

            $revenue = Guest::whereBetween('created_at', [$start, $end])->sum('total_bayar')
                     + AppGuest::whereBetween('created_at', [$start, $end])->sum(DB::raw('prepaid + pah'));

            return [
                'label'   => 'Mgg ' . $start->format('d/m'),
                'count'   => (int) $count,
                'revenue' => (int) $revenue,
            ];
        });

        // ── GRAFIK BULANAN (6 Bulan Terakhir) ────────────────────────────────

        $monthlyData = collect(range(5, 0))->map(function ($monthsAgo) {
            $date = now()->subMonths($monthsAgo);
            $m    = $date->month;
            $y    = $date->year;

            $count = Guest::where('month', $m)->where('year', $y)->count()
                   + AppGuest::where('month', $m)->where('year', $y)->count();

            $revenue = Guest::where('month', $m)->where('year', $y)->sum('total_bayar')
                     + AppGuest::where('month', $m)->where('year', $y)->sum(DB::raw('prepaid + pah'));

            return [
                'label'   => $date->translatedFormat('M'),
                'count'   => (int) $count,
                'revenue' => (int) $revenue,
            ];
        });

        // ── RENDER ────────────────────────────────────────────────────────────

        return Inertia::render('Keuangan/Index', [
            'stats' => [
                // Harian
                'todayGuests'      => $todayGuests,
                'todayRevenue'     => (int) $todayRevenue,
                'todayExpense'     => (int) $todayExpense,

                // Tamu bulanan
                'guestThisMonth'   => $guestThisMonth,
                'guestLastMonth'   => $guestLastMonth,
                'guestGrowth'      => $guestGrowth,   // null jika tidak ada data bulan lalu

                // Revenue bulanan
                'revenueThisMonth' => (int) $revenueThisMonth,
                'revenueLastMonth' => (int) $revenueLastMonth,
                'revenueGrowth'    => $revenueGrowth, // null jika tidak ada data bulan lalu

                // Pengeluaran bulanan
                'expenseThisMonth' => (int) $expenseThisMonth,
                'expenseLastMonth' => (int) $expenseLastMonth,
                'expenseGrowth'    => $expenseGrowth, // null jika tidak ada data bulan lalu

                // Laba bersih bulanan
                'profitThisMonth'  => (int) $profitThisMonth,
                'profitLastMonth'  => (int) $profitLastMonth,
                'profitGrowth'     => $profitGrowth,  // null jika tidak ada data bulan lalu
            ],
            'weeklyGuests' => $weeklyGuests,
            'monthlyData'  => $monthlyData,
        ]);
    }
}
<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\AppGuestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DashboardKeuanganController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\LaporanController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

/*
|─────────────────────────────────────────────────────────────────────────────
| HAK AKSES PER ROLE
|─────────────────────────────────────────────────────────────────────────────
| owner : semua fitur + audit log + dashboard keuangan
| admin : dashboard biasa, guest, app-guest, pengeluaran, profile
|─────────────────────────────────────────────────────────────────────────────
| RATE LIMIT (didefinisikan di AppServiceProvider)
|─────────────────────────────────────────────────────────────────────────────
| tamu        : login=200/menit, tidak login=30/menit
| admin-umum  : 120/menit per user (baca data)
| admin-tulis : 60/menit per user  (tulis/ubah/hapus data)
| keuangan    : 30/menit per user  (data keuangan)
| audit       : 30/menit per user  (lihat audit log)
| audit-export: 5/menit per user   (export audit log)
|─────────────────────────────────────────────────────────────────────────────
*/


// ─── Halaman Publik ───────────────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
})->middleware('throttle:tamu');


// ─── Route Terautentikasi ─────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // ── Dashboard Utama (owner & admin) ───────────────────────────────────────
    Route::middleware(['role:owner,admin', 'throttle:admin-umum'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    });

    Route::middleware(['role:owner,admin', 'throttle:admin-tulis'])->group(function () {
        Route::post('/dashboard/create-file',              [DashboardController::class, 'createFile'])->name('dashboard.createFile');
        Route::patch('/dashboard/update-file/{pembukuan}', [DashboardController::class, 'updateFile'])->name('dashboard.updateFile');
        Route::delete('/dashboard/delete-file',            [DashboardController::class, 'deleteFile'])->name('dashboard.deleteFile');
    });


    // ── Dashboard Keuangan (owner only) ───────────────────────────────────────
    Route::middleware(['role:owner,admin', 'throttle:keuangan'])->group(function () {
        Route::get('/Keuangan', [DashboardKeuanganController::class, 'index'])->name('dashboardkeuangan');
    });


    // ── Checkin Reguler (owner & admin) ──────────────────────────────────────
    Route::middleware(['role:owner,admin', 'throttle:admin-umum'])->group(function () {
        Route::get('/guest', [GuestController::class, 'index'])->name('guest.index');
    });

    Route::middleware(['role:owner,admin', 'throttle:admin-tulis'])->group(function () {
        Route::post('/guest',                 [GuestController::class, 'store'])->name('guest.store');
        Route::patch('/guest/{guest}/status', [GuestController::class, 'updateStatus'])->name('guest.status');
        Route::patch('/guest/{guest}',        [GuestController::class, 'update'])->name('guest.update');
        Route::delete('/guest/{guest}',       [GuestController::class, 'destroy'])->name('guest.destroy');
    });


    // ── Checkin Aplikasi / OTA (owner & admin) ────────────────────────────────
    Route::middleware(['role:owner,admin', 'throttle:admin-umum'])->group(function () {
        Route::get('/app-guest', [AppGuestController::class, 'index'])->name('app-guest.index');
    });

    Route::middleware(['role:owner,admin', 'throttle:admin-tulis'])->group(function () {
        Route::post('/app-guest',                    [AppGuestController::class, 'store'])->name('app-guest.store');
        Route::patch('/app-guest/{appGuest}/status', [AppGuestController::class, 'updateStatus'])->name('app-guest.status');
        Route::patch('/app-guest/{appGuest}',        [AppGuestController::class, 'update'])->name('app-guest.update');
        Route::delete('/app-guest/{appGuest}',       [AppGuestController::class, 'destroy'])->name('app-guest.destroy');
    });


    // ── Pengeluaran (owner & admin) ───────────────────────────────────────────
    Route::middleware(['role:owner,admin', 'throttle:keuangan'])->group(function () {
        Route::post('/pengeluaran', [PengeluaranController::class, 'store'])->name('pengeluaran.store');
    });


    // ── Audit Log (owner only) ────────────────────────────────────────────────
    Route::middleware(['role:owner', 'throttle:audit'])->group(function () {
        Route::get('/audit', [AuditLogController::class, 'index'])->name('audit.index');
    });

    Route::middleware(['role:owner', 'throttle:audit-export'])->group(function () {
        Route::get('/audit/export', [AuditLogController::class, 'export'])->name('audit.export');
    });


    // ── Profile (owner & admin) ───────────────────────────────────────────────
    Route::middleware(['role:owner,admin', 'throttle:admin-umum'])->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    });

    Route::middleware(['role:owner,admin', 'throttle:admin-tulis'])->group(function () {
        Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
    // ── Laporan PDF (owner & admin) ───────────────────────────────────────────
    Route::middleware(['role:owner,admin', 'throttle:audit-export'])->group(function () {
        Route::get('/laporan/pdf', [LaporanController::class, 'downloadPdf'])->name('laporan.pdf');
    });
});

require __DIR__.'/auth.php';
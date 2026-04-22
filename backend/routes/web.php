<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\AppGuestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DashboardKeuanganController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\PengeluaranController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard',                              [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/create-file',                 [DashboardController::class, 'createFile'])->name('dashboard.createFile');
    Route::patch('/dashboard/update-file/{pembukuan}',    [DashboardController::class, 'updateFile'])->name('dashboard.updateFile');
    Route::delete('/dashboard/delete-file',               [DashboardController::class, 'deleteFile'])->name('dashboard.deleteFile');

    Route::get('/dashboardkeuangan', [DashboardKeuanganController::class, 'index'])->name('dashboardkeuangan');

    // Checkin Reguler
    Route::get('/guest',                          [GuestController::class, 'index'])->name('guest.index');
    Route::post('/guest',                         [GuestController::class, 'store'])->name('guest.store');
    Route::patch('/guest/{guest}/status',         [GuestController::class, 'updateStatus'])->name('guest.status');
    Route::patch('/guest/{guest}',                [GuestController::class, 'update'])->name('guest.update');
    Route::delete('/guest/{guest}',               [GuestController::class, 'destroy'])->name('guest.destroy');

    // Checkin Aplikasi (OTA)
    Route::get('/app-guest',                         [AppGuestController::class, 'index'])->name('app-guest.index');
    Route::post('/app-guest',                        [AppGuestController::class, 'store'])->name('app-guest.store');
    Route::patch('/app-guest/{appGuest}/status',     [AppGuestController::class, 'updateStatus'])->name('app-guest.status');
    Route::patch('/app-guest/{appGuest}',            [AppGuestController::class, 'update'])->name('app-guest.update');
    Route::delete('/app-guest/{appGuest}',           [AppGuestController::class, 'destroy'])->name('app-guest.destroy');

    // Pengeluaran
    Route::post('/pengeluaran', [PengeluaranController::class, 'store'])->name('pengeluaran.store');

    // Audit Log
    Route::get('/audit',        [AuditLogController::class, 'index'])->name('audit.index');
    Route::get('/audit/export', [AuditLogController::class, 'export'])->name('audit.export');

    // Profile
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
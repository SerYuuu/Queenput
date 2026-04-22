<?php

namespace App\Providers;

use App\Models\Guest;
use App\Models\AppGuest;
use App\Observers\GuestObserver;
use App\Observers\AppGuestObserver; // Pastikan ini sudah dibuat
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider; // Perbaikan backslash di sini

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Daftarkan masing-masing model ke observer yang tepat
        Guest::observe(GuestObserver::class);
        AppGuest::observe(AppGuestObserver::class); 
    }
}
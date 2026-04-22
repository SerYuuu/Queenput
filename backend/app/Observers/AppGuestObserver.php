<?php

namespace App\Observers;

use App\Models\AppGuest;

class AppGuestObserver
{
    public function created(AppGuest $appGuest): void
    {
        // Logika setelah data OTA berhasil disimpan
    }

    public function updated(AppGuest $appGuest): void
    {
        // Logika setelah data OTA diupdate
    }

    public function deleted(AppGuest $appGuest): void
    {
        //
    }
}
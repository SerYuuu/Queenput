<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Guest;
use App\Models\AppGuest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Gunakan updateOrCreate agar jika email sudah ada, data hanya diupdate, bukan buat baru (menghindari error duplicate)
        $owner = User::updateOrCreate(
            ['email' => 'owner@queenput.com'],
            [
                'name'     => 'Owner Queenput',
                'password' => Hash::make('123'),
                'role'     => 'owner',
            ]
        );

        $admin = User::updateOrCreate(
            ['email' => 'admin@queenput.com'],
            [
                'name'     => 'Admin Queenput',
                'password' => Hash::make('123'),
                'role'     => 'admin',
            ]
        );

        // Membuat 50 Guest Reguler dan hubungkan ke ID Admin
        Guest::factory(50)->create([
            'user_id' => $admin->id
        ]);

        // Membuat 50 Guest OTA/Aplikasi dan hubungkan ke ID Admin
        AppGuest::factory(50)->create([
            'user_id' => $admin->id
        ]);
        
        $this->command->info('Berhasil membuat user dan 100 data dummy!');
    }
}
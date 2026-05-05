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
        // 1. Buat atau update user admin/owner
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

        // 2. Gunakan withoutEvents agar Observer Audit Log tidak memicu error Integrity Constraint
        Guest::withoutEvents(function () use ($admin) {
            Guest::factory(50)->create([
                'user_id' => $admin->id
            ]);
        });

        AppGuest::withoutEvents(function () use ($admin) {
            AppGuest::factory(50)->create([
                'user_id' => $admin->id
            ]);
        });
        
        $this->command->info('Berhasil membuat user dan 100 data dummy tanpa error audit!');
    }
}
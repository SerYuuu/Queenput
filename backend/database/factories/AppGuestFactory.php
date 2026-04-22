<?php

namespace Database\Factories;

use App\Models\AppGuest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AppGuest>
 */
class AppGuestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    return [
        'user_id' => 1,
        'month' => 4,
        'year' => 2026,
        'nomor_kamar' => fake()->numberBetween(1, 100),
        'nama_tamu' => fake()->name(),
        'tanggal_checkin' => '15:00',
        'tanggal_checkout' => '12:00',
        'prepaid' => fake()->randomElement([180000, 220000]),
        'pah' => 0,
        'alamat' => fake()->city(),
        'nik' => fake()->numerify('################'),
        'keterangan' => 'Dummy OTA',
        'shift_admin' => fake()->randomElement(['Pagi-Raihan', 'Siang-Raihan', 'Malam-Raihan']),
        'tanggal_input' => '2026-04-22',
        'status' => 'checkin',
    ];
}
}

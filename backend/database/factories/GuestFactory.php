<?php

namespace Database\Factories;

use App\Models\Guest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Guest>
 */
class GuestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    return [
        'user_id' => 1, // Sesuaikan ID user admin
        'month' => 4,
        'year' => 2026,
        'nomor_kamar' => fake()->numberBetween(1, 100),
        'nama_tamu' => fake()->name(),
        'tanggal_checkin' => '14:00',
        'tanggal_checkout' => '12:00',
        'total_bayar' => fake()->randomElement([150000, 200000, 250000, 300000]),
        'alamat' => fake()->city(),
        'nik' => fake()->numerify('################'),
        'keterangan' => 'Dummy Reguler',
        'shift_admin' => fake()->randomElement(['Pagi-Raihan', 'Siang-Raihan', 'Malam-Raihan']),
        'tanggal_input' => '2026-04-22',
        'status' => 'checkin',
    ];
}
}

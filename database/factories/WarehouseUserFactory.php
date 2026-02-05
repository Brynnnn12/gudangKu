<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WarehouseUser>
 */
class WarehouseUserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-1 year', 'now');

        return [
            'warehouse_id' => \App\Models\Warehouse::inRandomOrder()->first()?->id ?? \App\Models\Warehouse::factory(),
            'user_id' => \App\Models\User::inRandomOrder()->first()?->id ?? \App\Models\User::factory(),
            'start_date' => $startDate,
            'end_date' => fake()->optional(0.3)->dateTimeBetween($startDate, '+1 year'), // 30% chance of having end_date
        ];
    }
}

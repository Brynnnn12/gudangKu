<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockLog>
 */
class StockLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['entry', 'exit', 'transfer', 'adjustment', 'damage'];
        $type = fake()->randomElement($types);

        // Qty positif untuk entry, negatif untuk lainnya
        $qty = match ($type) {
            'entry' => fake()->numberBetween(10, 100),
            'exit' => -fake()->numberBetween(5, 50),
            'transfer' => -fake()->numberBetween(10, 30),
            'adjustment' => fake()->numberBetween(-20, 20),
            'damage' => -fake()->numberBetween(1, 10),
        };

        return [
            'warehouse_id' => \App\Models\Warehouse::factory(),
            'product_id' => \App\Models\Product::factory(),
            'batch_id' => null, // Will be implemented when StockBatch model is created
            'user_id' => \App\Models\User::factory(),
            'qty' => $qty,
            'type' => $type,
            'notes' => fake()->boolean(60) ? fake()->sentence() : null,
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\WarehouseStock;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockBatch>
 */
class StockBatchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $expiredAt = fake()->optional(0.8)->dateTimeBetween('now', '+2 years');
        $currentQty = fake()->numberBetween(10, 500);

        return [
            'warehouse_stock_id' => WarehouseStock::factory(),
            'batch_number' => 'BATCH-'.strtoupper(fake()->bothify('??###??')),
            'expired_at' => $expiredAt,
            'current_qty' => $currentQty,
            'cost_price' => fake()->randomFloat(2, 5000, 500000),
            'is_active' => true,
            'status' => $expiredAt ? ($expiredAt < now() ? 'expired' : (now()->diffInDays($expiredAt) <= 30 ? 'warning' : 'available')) : 'available',
        ];
    }

    /**
     * Indicate that the batch is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expired_at' => fake()->dateTimeBetween('-6 months', 'now'),
            'status' => 'expired',
            'is_active' => false,
            'current_qty' => 0,
        ]);
    }

    /**
     * Indicate that the batch is near expiry.
     */
    public function nearExpiry(): static
    {
        return $this->state(fn (array $attributes) => [
            'expired_at' => fake()->dateTimeBetween('now', '+30 days'),
            'status' => 'warning',
        ]);
    }
}

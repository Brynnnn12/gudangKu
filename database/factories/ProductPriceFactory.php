<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductPrice>
 */
class ProductPriceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $costPrice = fake()->randomFloat(2, 10000, 500000);
        $sellingPrice = $costPrice * fake()->randomFloat(2, 1.2, 2.5);

        return [
            'product_id' => \App\Models\Product::factory(),
            'cost_price' => $costPrice,
            'selling_price' => round($sellingPrice, 2),
            'effective_from' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}

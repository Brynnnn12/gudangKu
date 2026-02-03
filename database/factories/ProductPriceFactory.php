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
        $costPrice = fake()->randomFloat(2, 5000, 150000); // 5rb - 150rb
        $margin = fake()->randomFloat(2, 1.1, 1.8); // Margin 10-80%
        $sellingPrice = $costPrice * $margin;

        return [
            'product_id' => \App\Models\Product::factory(),
            'cost_price' => $costPrice,
            'selling_price' => round($sellingPrice, 2),
            'effective_from' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $units = ['Karton', 'Box', 'Pcs', 'Liter', 'Kg', 'Meter', 'Buah', 'Lusin', 'Pack'];
        $brands = ['Samsung', 'LG', 'Sony', 'Panasonic', 'Sharp', 'Toshiba', 'Philips', 'Polytron', 'Maspion', 'Cosmos'];

        return [
            'category_id' => \App\Models\Category::factory(),
            'name' => fake()->words(3, true),
            'brand' => fake()->randomElement($brands),
            'unit' => fake()->randomElement($units),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-####-????')),
        ];
    }
}

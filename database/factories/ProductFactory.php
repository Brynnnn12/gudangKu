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
        $units = ['Karton', 'Box', 'Pcs', 'Liter', 'Kg', 'Meter', 'Buah', 'Lusin', 'Pack', 'Dus', 'Sak', 'Kaleng'];
        $brands = ['Indomilk', 'Ultra Milk', 'Susu Bendera', 'Cap Botol', 'Dancow', 'Lactogen', 'Bear Brand', 'Milo', 'Nescafe', 'Good Day', 'Teh Botol', 'Pocari Sweat', 'Sprite', 'Coca Cola', 'Fanta', 'Aqua', 'Le Minerale', 'Ades', 'Nutrisari', 'Floridina'];

        $products = [
            // Susu dan Olahan Susu
            'Susu UHT Full Cream 1L',
            'Susu Bubuk Dancow 400g',
            'Yogurt Cimory Plain 150g',
            'Keju Cheddar Kraft 200g',
            'Mentega Blue Band 200g',
            'Margarin Palmia 200g',

            // Minuman
            'Teh Celup Sariwangi 25pcs',
            'Kopi Instant Good Day 200g',
            'Minuman Serbuk Milo 400g',
            'Air Mineral Aqua 600ml',
            'Jus Jeruk Sunquick 500ml',
            'Soda Sprite 390ml',

            // Makanan Ringan
            'Biskuit Roma Kelapa 125g',
            'Wafer Tango Coklat 120g',
            'Keripik Kentang Lays 75g',
            'Permen Kopiko 20g',
            'Coklat SilverQueen 65g',
            'Snack Chiki Balls 100g',

            // Bahan Pokok
            'Beras Premium 5kg',
            'Minyak Goreng Bimoli 2L',
            'Gula Pasir 1kg',
            'Tepung Terigu Segitiga Biru 1kg',
            'Kecap Manis ABC 520ml',
            'Saus Tomat Del Monte 520ml',

            // Produk Bayi
            'Susu Formula Lactogen 400g',
            'Popok MamyPoko 42pcs',
            'Sabun Bayi Johnson 100g',
            'Shampoo Bayi Johnson 200ml',

            // Produk Rumah Tangga
            'Sabun Cuci Rinso 1.8kg',
            'Deterjen Attack 400g',
            'Pembersih Lantai Mr. Muscle 750ml',
            'Tissue Paseo 200lembar',
        ];

        return [
            'category_id' => \App\Models\Category::inRandomOrder()->first()?->id ?? \App\Models\Category::factory(),
            'name' => fake()->randomElement($products),
            'brand' => fake()->randomElement($brands),
            'unit' => fake()->randomElement($units),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-####-????')),
        ];
    }
}

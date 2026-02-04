<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Susu & Produk Olahan Susu',
            'Minuman Ringan',
            'Makanan Ringan & Snack',
            'Bahan Pokok & Sembako',
            'Makanan Instan & Mi',
            'Minuman Dalam Kemasan',
            'Makanan Kaleng & Botol',
            'Bumbu Dapur & Rempah',
            'Makanan Beku & Frozen Food',
            'Minuman Tradisional',
            'Makanan Kering & Tahan Lama',
            'Minuman Segar & Jus',
            'Produk Susu & Yogurt',
            'Minuman Energi & Suplemen',
            'Makanan Siap Saji',
            'Kopi & Teh',
            'Coklat & Permen',
            'Makanan Bayi & Anak',
            'Produk Organik & Sehat',
            'Makanan Import',
        ];

        return [
            'name' => fake()->unique()->randomElement($categories),
        ];
    }
}

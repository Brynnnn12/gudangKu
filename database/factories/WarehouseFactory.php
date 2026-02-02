<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Warehouse>
 */
class WarehouseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $warehouseNames = [
            'Gudang Pusat Jakarta',
            'Gudang Cabang Surabaya',
            'Gudang Bandung',
            'Gudang Semarang',
            'Gudang Medan',
            'Gudang Makassar',
            'Gudang Palembang',
            'Gudang Yogyakarta',
        ];

        $cities = [
            'Jakarta' => [
                'Jl. Raya Bekasi No. 123, Jakarta Timur',
                'Jl. Gatot Subroto Kav. 52-53, Jakarta Selatan',
                'Jl. Pluit Raya No. 88, Jakarta Utara',
            ],
            'Surabaya' => [
                'Jl. Raya Darmo No. 135, Surabaya',
                'Jl. Mayjen Sungkono No. 89, Surabaya Barat',
            ],
            'Bandung' => [
                'Jl. Soekarno Hatta No. 456, Bandung',
                'Jl. Cibiru Raya No. 234, Bandung Timur',
            ],
            'Semarang' => [
                'Jl. Kaligawe Raya KM 5, Semarang',
            ],
            'Medan' => [
                'Jl. Gatot Subroto No. 234, Medan',
            ],
        ];

        $city = $this->faker->randomElement(array_keys($cities));
        $address = $this->faker->randomElement($cities[$city]);

        return [
            'name' => $this->faker->unique()->randomElement($warehouseNames),
            'address' => $address.', '.$city.', Indonesia '.$this->faker->postcode(),
        ];
    }
}

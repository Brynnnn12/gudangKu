<?php

namespace Database\Seeders;

use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $warehouses = [
            [
                'name' => 'Gudang Pusat Jakarta',
                'address' => 'Jl. Raya Bekasi No. 123, Jakarta Timur, DKI Jakarta 13920, Indonesia',
            ],
            [
                'name' => 'Gudang Cabang Surabaya',
                'address' => 'Jl. Raya Darmo No. 135, Surabaya, Jawa Timur 60241, Indonesia',
            ],
            [
                'name' => 'Gudang Bandung',
                'address' => 'Jl. Soekarno Hatta No. 456, Bandung, Jawa Barat 40286, Indonesia',
            ],
            [
                'name' => 'Gudang Semarang',
                'address' => 'Jl. Kaligawe Raya KM 5, Semarang, Jawa Tengah 50112, Indonesia',
            ],
            [
                'name' => 'Gudang Medan',
                'address' => 'Jl. Gatot Subroto No. 234, Medan, Sumatera Utara 20235, Indonesia',
            ],
        ];

        foreach ($warehouses as $warehouse) {
            Warehouse::create($warehouse);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductPriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\ProductPrice::factory()->count(4)->create();
    }
}

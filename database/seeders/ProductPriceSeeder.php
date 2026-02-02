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
        //factory call to create product prices
        \App\Models\ProductPrice::factory()->count(50)->create();
    }
}

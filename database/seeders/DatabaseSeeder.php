<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,           // 1. Create users & roles first
            CategorySeeder::class,       // 2. Create categories
            WarehouseSeeder::class,      // 3. Create warehouses
            ProductSeeder::class,        // 4. Create products (needs categories)
            ProductPriceSeeder::class,   // 5. Create product prices (needs products)
            WarehouseUserSeeder::class,  // 6. Assign users to warehouses
        ]);
    }
}

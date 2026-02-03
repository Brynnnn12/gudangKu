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
            WarehouseStockSeeder::class, // 7. Create warehouse stocks (needs warehouses + products)
            StockBatchSeeder::class,     // 8. Create stock batches (needs warehouse stocks)
            StockLogSeeder::class,       // 9. Create stock logs (optional, needs everything)
            StockTransferSeeder::class,  // 10. Create stock transfers (needs warehouses + products + users)
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Warehouse;
use App\Models\WarehouseStock;
use Illuminate\Database\Seeder;

class WarehouseStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $warehouses = Warehouse::all();
        $products = Product::all();

        // Create warehouse stocks for each warehouse with various products
        foreach ($warehouses as $warehouse) {
            // Each warehouse has 60-80% of all products
            $productsForWarehouse = $products->random(rand((int) ($products->count() * 0.6), (int) ($products->count() * 0.8)));

            foreach ($productsForWarehouse as $product) {
                WarehouseStock::create([
                    'warehouse_id' => $warehouse->id,
                    'product_id' => $product->id,
                    'total_quantity' => rand(50, 500),
                ]);
            }
        }
    }
}

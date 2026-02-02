<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\StockLog;
use App\Models\User;
use App\Models\Warehouse;
use App\Models\WarehouseStock;
use Illuminate\Database\Seeder;

class StockLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $warehouses = Warehouse::all();
        $products = Product::all();
        $users = User::all();
        $warehouseStocks = WarehouseStock::with('product', 'warehouse')->get();

        // Create realistic stock logs based on existing warehouse stocks
        foreach ($warehouseStocks as $warehouseStock) {
            // Entry logs (stock masuk)
            $entryCount = rand(3, 8);
            for ($i = 0; $i < $entryCount; $i++) {
                StockLog::create([
                    'warehouse_id' => $warehouseStock->warehouse_id,
                    'product_id' => $warehouseStock->product_id,
                    'batch_id' => null,
                    'user_id' => $users->random()->id,
                    'qty' => rand(20, 100),
                    'type' => 'entry',
                    'notes' => fake()->boolean(50) ? 'Stock masuk dari supplier' : null,
                    'created_at' => fake()->dateTimeBetween('-6 months', '-1 month'),
                ]);
            }

            // Exit logs (stock keluar)
            $exitCount = rand(2, 5);
            for ($i = 0; $i < $exitCount; $i++) {
                StockLog::create([
                    'warehouse_id' => $warehouseStock->warehouse_id,
                    'product_id' => $warehouseStock->product_id,
                    'batch_id' => null,
                    'user_id' => $users->random()->id,
                    'qty' => -rand(10, 50),
                    'type' => 'exit',
                    'notes' => fake()->boolean(50) ? 'Penjualan ke customer' : null,
                    'created_at' => fake()->dateTimeBetween('-1 month', 'now'),
                ]);
            }

            // Adjustment logs (kadang-kadang)
            if (fake()->boolean(30)) {
                StockLog::create([
                    'warehouse_id' => $warehouseStock->warehouse_id,
                    'product_id' => $warehouseStock->product_id,
                    'batch_id' => null,
                    'user_id' => $users->random()->id,
                    'qty' => rand(-10, 10),
                    'type' => 'adjustment',
                    'notes' => 'Adjustment stok opname',
                    'created_at' => fake()->dateTimeBetween('-2 months', 'now'),
                ]);
            }

            // Damage logs (kadang-kadang)
            if (fake()->boolean(20)) {
                StockLog::create([
                    'warehouse_id' => $warehouseStock->warehouse_id,
                    'product_id' => $warehouseStock->product_id,
                    'batch_id' => null,
                    'user_id' => $users->random()->id,
                    'qty' => -rand(1, 5),
                    'type' => 'damage',
                    'notes' => 'Barang rusak/expired',
                    'created_at' => fake()->dateTimeBetween('-3 months', 'now'),
                ]);
            }
        }
    }
}

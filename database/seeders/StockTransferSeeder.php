<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\StockTransfer;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class StockTransferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates various stock transfer scenarios.
     */
    public function run(): void
    {
        $warehouses = Warehouse::all();
        $products = Product::all();
        $users = User::all();

        if ($warehouses->count() < 2) {
            $this->command->warn('Need at least 2 warehouses for stock transfers.');

            return;
        }

        // Create pending transfers
        foreach (range(1, 15) as $i) {
            $fromWarehouse = $warehouses->random();
            $toWarehouse = $warehouses->where('id', '!=', $fromWarehouse->id)->random();

            StockTransfer::factory()
                ->pending()
                ->create([
                    'from_warehouse_id' => $fromWarehouse->id,
                    'to_warehouse_id' => $toWarehouse->id,
                    'product_id' => $products->random()->id,
                    'user_id' => $users->random()->id,
                ]);
        }

        // Create completed transfers
        foreach (range(1, 25) as $i) {
            $fromWarehouse = $warehouses->random();
            $toWarehouse = $warehouses->where('id', '!=', $fromWarehouse->id)->random();

            StockTransfer::factory()
                ->completed()
                ->create([
                    'from_warehouse_id' => $fromWarehouse->id,
                    'to_warehouse_id' => $toWarehouse->id,
                    'product_id' => $products->random()->id,
                    'user_id' => $users->random()->id,
                ]);
        }

        // Create rejected transfers
        foreach (range(1, 10) as $i) {
            $fromWarehouse = $warehouses->random();
            $toWarehouse = $warehouses->where('id', '!=', $fromWarehouse->id)->random();

            StockTransfer::factory()
                ->rejected()
                ->create([
                    'from_warehouse_id' => $fromWarehouse->id,
                    'to_warehouse_id' => $toWarehouse->id,
                    'product_id' => $products->random()->id,
                    'user_id' => $users->random()->id,
                ]);
        }

        $this->command->info('Created 50 stock transfers (15 pending, 25 completed, 10 rejected).');
    }
}

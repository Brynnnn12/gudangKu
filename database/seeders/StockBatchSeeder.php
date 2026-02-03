<?php

namespace Database\Seeders;

use App\Actions\StockBatches\CreateStockBatchAction;
use App\Models\Product;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;

class StockBatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates batches using CreateStockBatchAction (auto-creates WarehouseStock).
     */
    public function run(): void
    {
        $superAdmin = User::role('super-admin')->first();
        Auth::login($superAdmin);

        $warehouses = Warehouse::all();
        $products = Product::all();
        $action = new CreateStockBatchAction();

        foreach ($warehouses as $warehouse) {
            // Each warehouse has 60-80% of all products
            $productsForWarehouse = $products->random(rand((int) ($products->count() * 0.6), (int) ($products->count() * 0.8)));

            foreach ($productsForWarehouse as $product) {
                // Create 2-4 batches per product per warehouse
                $batchCount = rand(2, 4);

                for ($i = 0; $i < $batchCount; $i++) {
                    $qty = rand(50, 300);

                    // 70% chance to have expiry date
                    $hasExpiry = rand(1, 100) <= 70;
                    $expiredAt = null;

                    if ($hasExpiry) {
                        // Random distribution:
                        $rand = rand(1, 100);
                        if ($rand <= 10) {
                            // 10% expired (past dates)
                            $expiredAt = now()->subDays(rand(1, 180));
                        } elseif ($rand <= 25) {
                            // 15% near expiry (within 30 days)
                            $expiredAt = now()->addDays(rand(1, 30));
                        } else {
                            // 65% available (31+ days)
                            $expiredAt = now()->addDays(rand(31, 730)); // up to 2 years
                        }
                    }

                    // Create batch via action (auto-creates WarehouseStock + StockLog)
                    $action->execute([
                        'warehouse_id' => $warehouse->id,
                        'product_id' => $product->id,
                        'batch_number' => 'BATCH-'.strtoupper(fake()->bothify('??###??')),
                        'expired_at' => $expiredAt,
                        'current_qty' => $qty,
                        'cost_price' => fake()->numberBetween(5000, 150000),
                    ]);
                }
            }
        }

        Auth::logout();

        $this->command->info('Stock batches seeded successfully!');
    }
}

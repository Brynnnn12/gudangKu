<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class WarehouseStockSeeder extends Seeder
{
    /**
     * ⚠️ DEPRECATED: WarehouseStock should NOT be created manually.
     *
     * WarehouseStock records are now auto-created by StockBatchSeeder.
     * This seeder is kept for DatabaseSeeder call order compatibility.
     *
     * Logic: WarehouseStock.total_quantity = SUM(batches.current_qty)
     * Source of truth: StockBatch, not WarehouseStock
     */
    public function run(): void
    {
        // Do nothing - WarehouseStock will be auto-created by StockBatchSeeder
        $this->command->info('WarehouseStock seeder skipped (auto-created via batches).');
    }
}

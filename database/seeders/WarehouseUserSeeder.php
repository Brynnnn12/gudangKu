<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Warehouse;
use App\Models\WarehouseUser;
use Illuminate\Database\Seeder;

class WarehouseUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'viewer']);
        })->get();

        $warehouses = Warehouse::all();

        // Assign each non-super-admin user to 1-3 random warehouses
        foreach ($users as $user) {
            $warehouseCount = rand(1, 3);
            $assignedWarehouses = $warehouses->random(min($warehouseCount, $warehouses->count()));

            foreach ($assignedWarehouses as $warehouse) {
                WarehouseUser::factory()->create([
                    'user_id' => $user->id,
                    'warehouse_id' => $warehouse->id,
                ]);
            }
        }

        $this->command->info('Warehouse users seeded successfully!');
    }
}

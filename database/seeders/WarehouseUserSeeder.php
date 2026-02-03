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

        // Assign each user to only ONE random warehouse (one user = one warehouse)
        foreach ($users as $user) {
            $warehouse = $warehouses->random();

            WarehouseUser::factory()->create([
                'user_id' => $user->id,
                'warehouse_id' => $warehouse->id,
                'start_date' => now()->subDays(rand(30, 180)),
                'end_date' => null, // Active assignment
            ]);
        }

        $this->command->info('Warehouse users seeded successfully! Each user assigned to one warehouse only.');
    }
}

<?php

namespace App\Actions\WarehouseUsers;

use App\Models\WarehouseUser;

class CreateWarehouseUserAction
{
    /**
     * Create a new warehouse user.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): WarehouseUser
    {
        // Cek apakah sudah ada record yang di-soft delete dengan kombinasi yang sama
        $existingDeleted = WarehouseUser::withTrashed()
            ->where('warehouse_id', $input['warehouse_id'])
            ->where('user_id', $input['user_id'])
            ->first();

        // Jika ada yang sudah dihapus, restore saja
        if ($existingDeleted && $existingDeleted->trashed()) {
            $existingDeleted->restore();
            $existingDeleted->update([
                'start_date' => $input['start_date'],
                'end_date' => $input['end_date'] ?? null,
            ]);

            return $existingDeleted->fresh();
        }

        // Jika tidak ada, buat baru
        $warehouseUser = WarehouseUser::create([
            'warehouse_id' => $input['warehouse_id'],
            'user_id' => $input['user_id'],
            'start_date' => $input['start_date'],
            'end_date' => $input['end_date'] ?? null,
        ]);

        return $warehouseUser;
    }
}

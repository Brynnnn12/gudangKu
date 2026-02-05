<?php

namespace App\Actions\WarehouseUsers;

use App\Models\WarehouseUser;
use Illuminate\Support\Facades\DB;

class CreateWarehouseUserAction
{
    public function execute(array $input): WarehouseUser
    {
        return DB::transaction(function () use ($input) {
            $warehouseId = $input['warehouse_id'];
            $userId = $input['user_id'];
            $startDate = $input['start_date'] ?? now()->format('Y-m-d');
            $endDate = $input['end_date'] ?? null;

            $existing = WarehouseUser::withTrashed()
                ->where('warehouse_id', $warehouseId)
                ->where('user_id', $userId)
                ->lockForUpdate()
                ->first();

            if ($existing) {
                if ($existing->trashed()) {
                    $existing->restore();
                }

                $existing->update([
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]);

                return $existing->fresh();
            }

            return WarehouseUser::create([
                'warehouse_id' => $warehouseId,
                'user_id' => $userId,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);
        });
    }
}

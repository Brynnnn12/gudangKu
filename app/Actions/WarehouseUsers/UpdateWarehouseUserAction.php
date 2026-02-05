<?php

namespace App\Actions\WarehouseUsers;

use App\Models\WarehouseUser;
use Illuminate\Support\Facades\DB;

class UpdateWarehouseUserAction
{
    public function execute(WarehouseUser $warehouseUser, array $input): WarehouseUser
    {
        return DB::transaction(function () use ($warehouseUser, $input) {
            $oldWarehouseId = $warehouseUser->warehouse_id;
            $oldUserId = $warehouseUser->user_id;
            $newWarehouseId = $input['warehouse_id'];
            $newUserId = $input['user_id'];
            $startDate = $input['start_date'] ?? now()->format('Y-m-d');
            $endDate = $input['end_date'] ?? null;

            if ($oldWarehouseId === $newWarehouseId && $oldUserId === $newUserId) {
                $warehouseUser->update([
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]);

                return $warehouseUser->fresh();
            }

            $warehouseConflict = WarehouseUser::where('warehouse_id', $newWarehouseId)
                ->where('id', '!=', $warehouseUser->id)
                ->whereNull('deleted_at')
                ->lockForUpdate()
                ->first();

            $userConflict = WarehouseUser::where('user_id', $newUserId)
                ->where('id', '!=', $warehouseUser->id)
                ->whereNull('deleted_at')
                ->lockForUpdate()
                ->first();

            if ($oldUserId === $newUserId && $warehouseConflict) {
                $warehouseConflict->update(['warehouse_id' => $oldWarehouseId]);
            }

            if ($oldWarehouseId === $newWarehouseId && $userConflict) {
                $userConflict->update(['warehouse_id' => $oldWarehouseId]);
            }

            if ($oldUserId !== $newUserId && $oldWarehouseId !== $newWarehouseId) {
                if ($warehouseConflict && $userConflict) {
                    $userConflict->update(['warehouse_id' => $oldWarehouseId]);

                    if ($warehouseConflict->id !== $userConflict->id) {
                        $warehouseConflict->update(['warehouse_id' => $userConflict->warehouse_id]);
                    }
                } elseif ($warehouseConflict) {
                    $warehouseConflict->update(['warehouse_id' => $oldWarehouseId]);
                } elseif ($userConflict) {
                    $userConflict->update(['warehouse_id' => $oldWarehouseId]);
                }
            }

            $warehouseUser->update([
                'warehouse_id' => $newWarehouseId,
                'user_id' => $newUserId,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);

            return $warehouseUser->fresh();
        });
    }
}

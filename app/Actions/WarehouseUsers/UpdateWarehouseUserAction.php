<?php

namespace App\Actions\WarehouseUsers;

use App\Models\WarehouseUser;
use Illuminate\Support\Facades\DB;

class UpdateWarehouseUserAction
{
    /**
     * Update an existing warehouse user with automatic swap.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(WarehouseUser $warehouseUser, array $input): WarehouseUser
    {
        return DB::transaction(function () use ($warehouseUser, $input) {
            $oldWarehouseId = $warehouseUser->warehouse_id;
            $oldUserId = $warehouseUser->user_id;
            $newWarehouseId = $input['warehouse_id'];
            $newUserId = $input['user_id'];

            // Cek apakah ada perubahan
            if ($oldWarehouseId === $newWarehouseId && $oldUserId === $newUserId) {
                return $warehouseUser; // Tidak ada perubahan
            }

            // Cek apakah gudang baru sudah ada yang pegang
            $warehouseConflict = WarehouseUser::where('warehouse_id', $newWarehouseId)
                ->where('id', '!=', $warehouseUser->id)
                ->whereNull('deleted_at')
                ->first();

            // Cek apakah user baru sudah pegang gudang lain
            $userConflict = WarehouseUser::where('user_id', $newUserId)
                ->where('id', '!=', $warehouseUser->id)
                ->whereNull('deleted_at')
                ->first();

            // Scenario 1: Hanya ganti gudang (user sama)
            if ($oldUserId === $newUserId && $warehouseConflict) {
                // Swap: User lain di gudang baru pindah ke gudang lama
                $warehouseConflict->update(['warehouse_id' => $oldWarehouseId]);
            }

            // Scenario 2: Hanya ganti user (gudang sama)
            if ($oldWarehouseId === $newWarehouseId && $userConflict) {
                // Swap: User baru yang di gudang lain pindah ke gudang lama
                $userConflict->update(['warehouse_id' => $oldWarehouseId]);
            }

            // Scenario 3: Ganti user DAN gudang
            if ($oldUserId !== $newUserId && $oldWarehouseId !== $newWarehouseId) {
                if ($warehouseConflict && $userConflict) {
                    // Kedua-duanya konflik - swap kompleks
                    $tempWarehouse = $warehouseConflict->warehouse_id;

                    // User baru pindah ke gudang lama user lama
                    $userConflict->update(['warehouse_id' => $oldWarehouseId]);

                    // User yang pegang gudang baru (jika beda) pindah ke gudang user baru yang lama
                    if ($warehouseConflict->id !== $userConflict->id) {
                        $warehouseConflict->update(['warehouse_id' => $userConflict->warehouse_id]);
                    }
                } elseif ($warehouseConflict) {
                    // Hanya gudang konflik
                    $warehouseConflict->update(['warehouse_id' => $oldWarehouseId]);
                } elseif ($userConflict) {
                    // Hanya user konflik
                    $userConflict->update(['warehouse_id' => $oldWarehouseId]);
                }
            }

            // Update record utama
            $warehouseUser->update([
                'warehouse_id' => $newWarehouseId,
                'user_id' => $newUserId,
            ]);

            return $warehouseUser->fresh();
        });
    }
}

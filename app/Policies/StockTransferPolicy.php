<?php

namespace App\Policies;

use App\Models\StockTransfer;
use App\Models\User;

class StockTransferPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin', 'viewer']);
    }

    /**
     * Determine whether the user can view the model.
     * Super-admin and viewer can view all, admin only transfers involving their warehouses.
     */
    public function view(User $user, StockTransfer $stockTransfer): bool
    {
        if ($user->hasAnyRole(['super-admin', 'viewer'])) {
            return true;
        }

        // Admin hanya bisa melihat transfer dari/ke gudang yang dia ditugaskan
        if ($user->hasRole('admin')) {
            return $user->warehouses()->whereIn('warehouse_id', [
                $stockTransfer->from_warehouse_id,
                $stockTransfer->to_warehouse_id,
            ])->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     * Only super-admin and admin can create. Viewer cannot.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can update the model.
     * Only super-admin and admin can update pending transfers. Viewer cannot.
     */
    public function update(User $user, StockTransfer $stockTransfer): bool
    {
        if (! $stockTransfer->isPending()) {
            return false;
        }

        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can delete the model.
     * Only pending or rejected transfers can be deleted.
     */
    public function delete(User $user, StockTransfer $stockTransfer): bool
    {
        return $user->hasRole('super-admin') &&
               ($stockTransfer->isPending() || $stockTransfer->isRejected());
    }

    /**
     * Determine whether the user can approve/complete the transfer.
     * Only super-admin and admin can approve pending transfers. Viewer cannot.
     */
    public function approve(User $user, StockTransfer $stockTransfer): bool
    {
        if (! $stockTransfer->isPending()) {
            return false;
        }

        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can reject the transfer.
     * Only super-admin and admin can reject pending transfers. Viewer cannot.
     */
    public function reject(User $user, StockTransfer $stockTransfer): bool
    {
        if (! $stockTransfer->isPending()) {
            return false;
        }

        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, StockTransfer $stockTransfer): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, StockTransfer $stockTransfer): bool
    {
        return false;
    }
}

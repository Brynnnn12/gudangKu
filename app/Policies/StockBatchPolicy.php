<?php

namespace App\Policies;

use App\Models\StockBatch;
use App\Models\User;

class StockBatchPolicy
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
     * Super-admin and viewer can view all, admin only assigned warehouses.
     */
    public function view(User $user, StockBatch $stockBatch): bool
    {
        if ($user->hasAnyRole(['super-admin', 'viewer'])) {
            return true;
        }

        // Admin hanya bisa melihat batch dari gudang yang dia ditugaskan
        return $user->warehouses()->where('warehouse_id', $stockBatch->warehouseStock->warehouse_id)->exists();
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
     * Super-admin can update all, admin only assigned warehouses. Viewer cannot.
     */
    public function update(User $user, StockBatch $stockBatch): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            return $user->warehouses()->where('warehouse_id', $stockBatch->warehouseStock->warehouse_id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     * Only super-admin can delete. Admin and viewer cannot.
     */
    public function delete(User $user, StockBatch $stockBatch): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, StockBatch $stockBatch): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, StockBatch $stockBatch): bool
    {
        return false;
    }
}

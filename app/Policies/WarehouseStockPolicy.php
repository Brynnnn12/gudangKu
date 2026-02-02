<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WarehouseStock;

class WarehouseStockPolicy
{
    /**
     * Determine whether the user can view any models.
     * Admins can only view stocks from warehouses they are assigned to.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin', 'viewer']);
    }

    /**
     * Determine whether the user can view the model.
     * Check if user is assigned to the warehouse.
     */
    public function view(User $user, WarehouseStock $warehouseStock): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        // Check if user is assigned to this warehouse
        return $user->warehouses()->where('warehouse_id', $warehouseStock->warehouse_id)->exists();
    }

    /**
     * Determine whether the user can create models.
     * Only super-admin and admin can create warehouse stocks.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can update the model.
     * Admins can only update stocks from warehouses they are assigned to.
     */
    public function update(User $user, WarehouseStock $warehouseStock): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            return $user->warehouses()->where('warehouse_id', $warehouseStock->warehouse_id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     * Only super-admin can delete warehouse stocks.
     */
    public function delete(User $user, WarehouseStock $warehouseStock): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, WarehouseStock $warehouseStock): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, WarehouseStock $warehouseStock): bool
    {
        return $user->hasRole('super-admin');
    }
}

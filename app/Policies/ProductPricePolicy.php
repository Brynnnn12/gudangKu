<?php

namespace App\Policies;

use App\Models\ProductPrice;
use App\Models\User;

class ProductPricePolicy
{
    /**
     * Determine whether the user can view any models.
     * Super-admin, admin, and viewer can view product prices.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin', 'viewer']);
    }

    /**
     * Determine whether the user can view the model.
     * Super-admin, admin, and viewer can view product prices.
     */
    public function view(User $user, ProductPrice $productPrice): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin', 'viewer']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ProductPrice $productPrice): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProductPrice $productPrice): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can bulk delete models.
     */
    public function bulkDelete(User $user): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ProductPrice $productPrice): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ProductPrice $productPrice): bool
    {
        return $user->hasRole('super-admin');
    }
}

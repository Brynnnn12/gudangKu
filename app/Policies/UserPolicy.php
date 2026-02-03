<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     * Only super-admin can manage users.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can view the model.
     * Only super-admin can manage users.
     */
    public function view(User $user, User $model): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can create models.
     * Only super-admin can manage users.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can update the model.
     * Only super-admin can manage users.
     */
    public function update(User $user, User $model): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can delete the model.
     * Only super-admin can delete users.
     */
    public function delete(User $user, User $model): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        return false;
    }

    public function bulkDelete(User $user): bool
    {
        return $user->hasRole('super-admin');
    }
}

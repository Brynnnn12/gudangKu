<?php

namespace App\Policies;

use App\Models\StockLog;
use App\Models\User;

class StockLogPolicy
{
    /**
     * Determine whether the user can view any models.
     * Stock logs are read-only audit trails - all authenticated users can view.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin', 'viewer']);
    }

    /**
     * Determine whether the user can view the model.
     * Stock logs are read-only audit trails - all authenticated users can view.
     */
    public function view(User $user, StockLog $stockLog): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin', 'viewer']);
    }

    /**
     * Stock logs cannot be created manually - they are system-generated only.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Stock logs cannot be updated - they are permanent audit trails.
     */
    public function update(User $user, StockLog $stockLog): bool
    {
        return false;
    }

    /**
     * Stock logs cannot be deleted - they are permanent audit trails.
     */
    public function delete(User $user, StockLog $stockLog): bool
    {
        return false;
    }

    /**
     * Stock logs cannot be restored - they are never deleted.
     */
    public function restore(User $user, StockLog $stockLog): bool
    {
        return false;
    }

    /**
     * Stock logs cannot be force deleted - they are permanent audit trails.
     */
    public function forceDelete(User $user, StockLog $stockLog): bool
    {
        return false;
    }
}

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
     */
    public function view(User $user, StockTransfer $stockTransfer): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin', 'viewer']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can update the model.
     * Only pending transfers can be updated.
     */
    public function update(User $user, StockTransfer $stockTransfer): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']) && $stockTransfer->isPending();
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
     * Only pending transfers can be approved.
     */
    public function approve(User $user, StockTransfer $stockTransfer): bool
    {
        $hasRole = $user->hasAnyRole(['super-admin', 'admin']);
        $isPending = $stockTransfer->isPending();

        \Log::info('StockTransfer Policy Approve Check', [
            'user_id' => $user->id,
            'user_roles' => $user->roles->pluck('name')->toArray(),
            'transfer_id' => $stockTransfer->id,
            'transfer_status' => $stockTransfer->status,
            'has_role' => $hasRole,
            'is_pending' => $isPending,
            'result' => $hasRole && $isPending,
        ]);

        return $hasRole && $isPending;
    }

    /**
     * Determine whether the user can reject the transfer.
     * Only pending transfers can be rejected.
     */
    public function reject(User $user, StockTransfer $stockTransfer): bool
    {
        $hasRole = $user->hasAnyRole(['super-admin', 'admin']);
        $isPending = $stockTransfer->isPending();

        \Log::info('StockTransfer Policy Reject Check', [
            'user_id' => $user->id,
            'user_roles' => $user->roles->pluck('name')->toArray(),
            'transfer_id' => $stockTransfer->id,
            'transfer_status' => $stockTransfer->status,
            'has_role' => $hasRole,
            'is_pending' => $isPending,
            'result' => $hasRole && $isPending,
        ]);

        return $hasRole && $isPending;
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

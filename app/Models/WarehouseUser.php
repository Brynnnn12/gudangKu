<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class WarehouseUser extends Pivot
{
    /** @use HasFactory<\Database\Factories\WarehouseUserFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'warehouse_users';

    protected $fillable = [
        'warehouse_id',
        'user_id',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public $incrementing = true;

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('warehouse', function ($warehouse) use ($search) {
                    $warehouse->where('name', 'like', "%{$search}%");
                })
                    ->orWhereHas('user', function ($user) use ($search) {
                        $user->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }
    }

    /**
     * Get the warehouse that owns the warehouse user.
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * Get the user that owns the warehouse user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

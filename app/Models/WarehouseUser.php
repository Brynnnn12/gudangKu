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
    ];

    public $incrementing = true;

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

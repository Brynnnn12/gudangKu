<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Warehouse extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'address',
    ];

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Get the users assigned to this warehouse.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'warehouse_users')
            ->using(WarehouseUser::class) // Wajib panggil model pivot tadi
            ->withTimestamps()
            ->withPivot('deleted_at');
    }

    /**
     * Get the warehouse stocks for this warehouse.
     */
    public function warehouseStocks(): HasMany
    {
        return $this->hasMany(WarehouseStock::class);
    }

    // /**
    //  * Get the stock logs for this warehouse.
    //  */
    // public function stockLogs(): HasMany
    // {
    //     return $this->hasMany(StockLog::class);
    // }

    // /**
    //  * Get outgoing stock transfers from this warehouse.
    //  */
    // public function outgoingTransfers(): HasMany
    // {
    //     return $this->hasMany(StockTransfer::class, 'from_warehouse_id');
    // }

    // /**
    //  * Get incoming stock transfers to this warehouse.
    //  */
    // public function incomingTransfers(): HasMany
    // {
    //     return $this->hasMany(StockTransfer::class, 'to_warehouse_id');
    // }
}

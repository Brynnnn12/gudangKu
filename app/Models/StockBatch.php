<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class StockBatch extends Model
{

    use HasFactory;

    protected $fillable = [
        'warehouse_stock_id',
        'batch_number',
        'expired_at',
        'current_qty',
        'cost_price',
        'is_active',
        'status',
    ];

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('batch_number', 'like', "%{$search}%")
                    ->orWhereHas('warehouseStock.warehouse', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('warehouseStock.product', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }
    }


    protected function casts(): array
    {
        return [
            'expired_at' => 'date',
            'current_qty' => 'integer',
            'cost_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }


    public function warehouseStock(): BelongsTo
    {
        return $this->belongsTo(WarehouseStock::class);
    }


    public function stockLogs(): HasMany
    {
        return $this->hasMany(StockLog::class, 'batch_id');
    }


    public function isExpired(): bool
    {
        return $this->expired_at !== null && $this->expired_at->isPast();
    }


    public function isNearExpiry(int $days = 30): bool
    {
        return $this->expired_at !== null && $this->expired_at->diffInDays(now()) <= $days && ! $this->isExpired();
    }


    public function updateStatus(): void
    {
        if ($this->isExpired()) {
            $this->update(['status' => 'expired', 'is_active' => false]);
        } elseif ($this->isNearExpiry()) {
            $this->update(['status' => 'warning']);
        } else {
            $this->update(['status' => 'available']);
        }
    }
}

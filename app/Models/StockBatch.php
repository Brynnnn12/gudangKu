<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockBatch extends Model
{
    /** @use HasFactory<\Database\Factories\StockBatchFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'warehouse_stock_id',
        'batch_number',
        'expired_at',
        'current_qty',
        'cost_price',
        'is_active',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expired_at' => 'date',
            'current_qty' => 'integer',
            'cost_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the warehouse stock that owns this batch.
     */
    public function warehouseStock(): BelongsTo
    {
        return $this->belongsTo(WarehouseStock::class);
    }

    /**
     * Get all stock logs for this batch.
     */
    public function stockLogs(): HasMany
    {
        return $this->hasMany(StockLog::class, 'batch_id');
    }

    /**
     * Check if batch is expired.
     */
    public function isExpired(): bool
    {
        return $this->expired_at && $this->expired_at->isPast();
    }

    /**
     * Check if batch is near expiry (within 30 days).
     */
    public function isNearExpiry(int $days = 30): bool
    {
        return $this->expired_at && $this->expired_at->diffInDays(now()) <= $days && ! $this->isExpired();
    }

    /**
     * Update batch status based on expiry date.
     */
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

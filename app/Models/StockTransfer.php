<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockTransfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_warehouse_id',
        'to_warehouse_id',
        'product_id',
        'qty',
        'user_id',
        'status',
        'notes',
    ];

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('fromWarehouse', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('toWarehouse', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('product', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }
    }

    protected function casts(): array
    {
        return [
            'qty' => 'integer',
        ];
    }

    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id')->withTrashed();
    }

    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id')->withTrashed();
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}

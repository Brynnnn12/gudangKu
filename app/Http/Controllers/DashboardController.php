<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\StockBatch;
use App\Models\StockLog;
use App\Models\StockTransfer;
use App\Models\WarehouseStock;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display dashboard analytics.
     */
    public function index(): Response
    {
        $user = auth()->user();
        $isSuperAdmin = $user->hasRole('super-admin');

        // Get warehouse IDs for non-super-admin users
        $warehouseIds = $isSuperAdmin
            ? null
            : $user->warehouseUsers()->pluck('warehouse_id')->toArray();

        // 1. Summary Cards
        $summaryCards = $this->getSummaryCards($warehouseIds);

        // 2. Stock by Category Chart
        $stockByCategory = $this->getStockByCategory($warehouseIds);

        // 3. Stock Movement Chart (Last 7 Days)
        $stockMovement = $this->getStockMovement($warehouseIds);

        // 4. Recent Activities (Top 10 Stock Logs)
        $recentActivities = $this->getRecentActivities($warehouseIds);

        // 5. FEFO Warnings (Expired & Near Expiry Batches)
        $fefoWarnings = $this->getFefoWarnings($warehouseIds);

        return Inertia::render('dashboard', [
            'summaryCards' => $summaryCards,
            'stockByCategory' => $stockByCategory,
            'stockMovement' => $stockMovement,
            'recentActivities' => $recentActivities,
            'fefoWarnings' => $fefoWarnings,
        ]);
    }

    /**
     * Get summary cards data.
     */
    private function getSummaryCards(?array $warehouseIds): array
    {
        $warehouseStocksQuery = WarehouseStock::query();
        $stockBatchesQuery = StockBatch::query()->whereHas('warehouseStock');
        $stockTransfersQuery = StockTransfer::query();

        if ($warehouseIds !== null) {
            $warehouseStocksQuery->whereIn('warehouse_id', $warehouseIds);
            $stockBatchesQuery->whereHas('warehouseStock', fn ($q) => $q->whereIn('warehouse_id', $warehouseIds));
            $stockTransfersQuery->where(function ($q) use ($warehouseIds) {
                $q->whereIn('from_warehouse_id', $warehouseIds)
                    ->orWhereIn('to_warehouse_id', $warehouseIds);
            });
        }

        // Total Physical Stock
        $totalStock = $warehouseStocksQuery->sum('total_quantity');

        // Total Inventory Value
        $totalValue = $stockBatchesQuery->get()->sum(function ($batch) {
            return $batch->current_qty * $batch->cost_price;
        });

        // Near Expiry Count (< 3 months)
        $threeMonthsFromNow = now()->addMonths(3);
        $nearExpiryCount = StockBatch::query()
            ->when($warehouseIds !== null, fn ($q) => $q->whereHas('warehouseStock', fn ($sq) => $sq->whereIn('warehouse_id', $warehouseIds)))
            ->whereNotNull('expired_at')
            ->where('expired_at', '<=', $threeMonthsFromNow)
            ->where('current_qty', '>', 0)
            ->count();

        // Pending Transfers
        $pendingTransfers = $stockTransfersQuery->where('status', 'pending')->count();

        return [
            'totalStock' => $totalStock,
            'totalValue' => $totalValue,
            'nearExpiryCount' => $nearExpiryCount,
            'pendingTransfers' => $pendingTransfers,
        ];
    }

    /**
     * Get stock aggregated by category.
     */
    private function getStockByCategory(?array $warehouseIds): array
    {
        $categories = Category::query()
            ->with(['products' => function ($query) {
                $query->with('warehouseStocks');
            }])
            ->get()
            ->map(function ($category) use ($warehouseIds) {
                $total = $category->products->sum(function ($product) use ($warehouseIds) {
                    return $product->warehouseStocks
                        ->when($warehouseIds !== null, function ($collection) use ($warehouseIds) {
                            return $collection->whereIn('warehouse_id', $warehouseIds);
                        })
                        ->sum('total_quantity');
                });

                return [
                    'name' => $category->name,
                    'total' => $total,
                ];
            })
            ->filter(fn ($item) => $item['total'] > 0)
            ->sortByDesc('total')
            ->take(10)
            ->values();

        return $categories->toArray();
    }

    /**
     * Get stock movement for last 7 days.
     */
    private function getStockMovement(?array $warehouseIds): array
    {
        $sevenDaysAgo = now()->subDays(6)->startOfDay();

        $stockLogs = StockLog::query()
            ->when($warehouseIds !== null, fn ($q) => $q->whereIn('warehouse_id', $warehouseIds))
            ->where('created_at', '>=', $sevenDaysAgo)
            ->select([
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(CASE WHEN qty > 0 THEN qty ELSE 0 END) as stock_in'),
                DB::raw('SUM(CASE WHEN qty < 0 THEN ABS(qty) ELSE 0 END) as stock_out'),
            ])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Fill missing dates with zero values
        $result = [];
        for ($i = 0; $i < 7; $i++) {
            $date = now()->subDays(6 - $i)->format('Y-m-d');
            $log = $stockLogs->firstWhere('date', $date);

            $result[] = [
                'date' => $date,
                'stock_in' => $log ? (int) $log->stock_in : 0,
                'stock_out' => $log ? (int) $log->stock_out : 0,
            ];
        }

        return $result;
    }

    /**
     * Get recent activities from stock logs.
     */
    private function getRecentActivities(?array $warehouseIds): array
    {
        return StockLog::query()
            ->with(['warehouse', 'product', 'user'])
            ->when($warehouseIds !== null, fn ($q) => $q->whereIn('warehouse_id', $warehouseIds))
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'warehouse' => $log->warehouse->name,
                    'product' => $log->product->name,
                    'sku' => $log->product->sku,
                    'qty' => $log->qty,
                    'type' => $log->type,
                    'user' => $log->user->name,
                    'notes' => $log->notes,
                    'created_at' => $log->created_at->format('Y-m-d H:i'),
                ];
            })
            ->toArray();
    }

    /**
     * Get FEFO warnings (expired and near expiry batches).
     */
    private function getFefoWarnings(?array $warehouseIds): array
    {
        return StockBatch::query()
            ->with(['warehouseStock.warehouse', 'warehouseStock.product'])
            ->when($warehouseIds !== null, fn ($q) => $q->whereHas('warehouseStock', fn ($sq) => $sq->whereIn('warehouse_id', $warehouseIds)))
            ->whereIn('status', ['warning', 'expired'])
            ->where('current_qty', '>', 0)
            ->orderBy('expired_at', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'batch_number' => $batch->batch_number,
                    'warehouse' => $batch->warehouseStock->warehouse->name,
                    'product' => $batch->warehouseStock->product->name,
                    'sku' => $batch->warehouseStock->product->sku,
                    'qty' => $batch->current_qty,
                    'expired_at' => $batch->expired_at?->format('Y-m-d'),
                    'status' => $batch->status,
                    'days_until_expiry' => $batch->expired_at ? now()->diffInDays($batch->expired_at, false) : null,
                ];
            })
            ->toArray();
    }
}

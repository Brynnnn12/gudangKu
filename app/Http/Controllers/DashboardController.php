<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\StockBatch;
use App\Models\StockLog;
use App\Models\StockTransfer;
use App\Models\WarehouseStock;
use Illuminate\Support\Facades\Auth;
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
        $user = Auth::user();
        $isSuperAdmin = $user->hasRole('super-admin');

        // Get warehouse IDs for non-super-admin users
        $warehouseIds = $isSuperAdmin
            ? null
            : $user->warehouseUsers()->pluck('warehouse_id')->toArray();

        // 1. Summary Cards with Financial Metrics
        $summaryCards = $this->getSummaryCards($warehouseIds);

        // 2. Stock by Category Chart
        $stockByCategory = $this->getStockByCategory($warehouseIds);

        // 3. Revenue vs Cost Chart (Last 7 Days)
        $revenueVsCost = $this->getRevenueVsCost($warehouseIds);

        // 4. Recent Activities (Top 8 Stock Logs)
        $recentActivities = $this->getRecentActivities($warehouseIds);

        // 5. FEFO Warnings (Expired & Near Expiry Batches)
        $fefoWarnings = $this->getFefoWarnings($warehouseIds);

        return Inertia::render('dashboard', [
            'summaryCards' => $summaryCards,
            'stockByCategory' => $stockByCategory,
            'revenueVsCost' => $revenueVsCost,
            'recentActivities' => $recentActivities,
            'fefoWarnings' => $fefoWarnings,
        ]);
    }

    /**
     * Get summary cards data with financial metrics.
     */
    private function getSummaryCards(?array $warehouseIds): array
    {
        $sevenDaysAgo = now()->subDays(7);

        // Total Revenue (from stock out transactions in last 7 days)
        $revenueQuery = StockLog::query()
            ->join('stock_batches', 'stock_logs.batch_id', '=', 'stock_batches.id')
            ->where('stock_logs.created_at', '>=', $sevenDaysAgo)
            ->where('stock_logs.qty', '<', 0);

        if ($warehouseIds !== null) {
            $revenueQuery->whereIn('stock_logs.warehouse_id', $warehouseIds);
        }

        $totalRevenue = $revenueQuery->get()->sum(function ($log) {
            // Revenue = qty * cost_price * 1.3 (assume 30% markup)
            return abs($log->qty) * $log->cost_price * 1.3;
        });

        // Total Costs (from stock in transactions in last 7 days)
        $costsQuery = StockLog::query()
            ->join('stock_batches', 'stock_logs.batch_id', '=', 'stock_batches.id')
            ->where('stock_logs.created_at', '>=', $sevenDaysAgo)
            ->where('stock_logs.qty', '>', 0);

        if ($warehouseIds !== null) {
            $costsQuery->whereIn('stock_logs.warehouse_id', $warehouseIds);
        }

        $totalCosts = $costsQuery->get()->sum(function ($log) {
            return $log->qty * $log->cost_price;
        });

        // Profit Margin
        $profit = $totalRevenue - $totalCosts;
        $profitMargin = $totalRevenue > 0 ? ($profit / $totalRevenue) * 100 : 0;

        // Total Inventory Value
        $stockBatchesQuery = StockBatch::query()->whereHas('warehouseStock');
        if ($warehouseIds !== null) {
            $stockBatchesQuery->whereHas('warehouseStock', fn ($q) => $q->whereIn('warehouse_id', $warehouseIds));
        }

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

        return [
            'totalRevenue' => round($totalRevenue, 0),
            'totalCosts' => round($totalCosts, 0),
            'profit' => round($profit, 0),
            'profitMargin' => round($profitMargin, 1),
            'totalValue' => round($totalValue, 0),
            'nearExpiryCount' => $nearExpiryCount,
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
     * Get revenue vs cost for last 7 days.
     */
    private function getRevenueVsCost(?array $warehouseIds): array
    {
        $sevenDaysAgo = now()->subDays(6)->startOfDay();

        $stockLogs = StockLog::query()
            ->join('stock_batches', 'stock_logs.batch_id', '=', 'stock_batches.id')
            ->when($warehouseIds !== null, fn ($q) => $q->whereIn('stock_logs.warehouse_id', $warehouseIds))
            ->where('stock_logs.created_at', '>=', $sevenDaysAgo)
            ->select([
                DB::raw('DATE(stock_logs.created_at) as date'),
                DB::raw('SUM(CASE WHEN stock_logs.qty > 0 THEN stock_logs.qty * stock_batches.cost_price ELSE 0 END) as costs'),
                DB::raw('SUM(CASE WHEN stock_logs.qty < 0 THEN ABS(stock_logs.qty) * stock_batches.cost_price * 1.3 ELSE 0 END) as revenue'),
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
                'revenue' => $log ? (float) $log->revenue : 0,
                'costs' => $log ? (float) $log->costs : 0,
                'profit' => $log ? ((float) $log->revenue - (float) $log->costs) : 0,
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
            ->limit(8)
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

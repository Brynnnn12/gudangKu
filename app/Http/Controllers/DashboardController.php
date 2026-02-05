<?php

namespace App\Http\Controllers;

use App\Models\StockBatch;
use App\Models\StockLog;
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
        $isViewer = $user->hasRole('viewer');

        // Get warehouse IDs for non-super-admin users
        $warehouseIds = ($isSuperAdmin || $isViewer)
            ? null
            : $user->warehouses()->pluck('warehouses.id')->toArray();

        // 1. Summary Cards (3 Cards: Financial, Near Expiry, Stock Movement)
        $summaryCards = $this->getSummaryCards($warehouseIds);

        // 2. Stock by Warehouse
        $stockByWarehouse = $this->getStockByWarehouse($warehouseIds);

        // 3. Revenue vs Cost Chart (Last 7 Days)
        $revenueVsCost = $this->getRevenueVsCost($warehouseIds);

        // 4. Top Selling Products (Last 30 Days)
        $topSellingProducts = $this->getTopSellingProducts($warehouseIds);

        // 5. Recent Activities (Top 8 Stock Logs)
        $recentActivities = $this->getRecentActivities($warehouseIds);

        // 6. FEFO Warnings (Expired & Near Expiry Batches)
        $fefoWarnings = $this->getFefoWarnings($warehouseIds);

        return Inertia::render('dashboard', [
            'summaryCards' => $summaryCards,
            'stockByWarehouse' => $stockByWarehouse,
            'revenueVsCost' => $revenueVsCost,
            'topSellingProducts' => $topSellingProducts,
            'recentActivities' => $recentActivities,
            'fefoWarnings' => $fefoWarnings,
        ]);
    }

    /**
     * Get summary cards data with financial metrics (3 cards).
     */
    private function getSummaryCards(?array $warehouseIds): array
    {
        $sevenDaysAgo = now()->subDays(7);

        // Total Revenue (from stock out transactions in last 7 days)
        $revenueQuery = StockLog::query()
            ->join('stock_batches', 'stock_logs.batch_id', '=', 'stock_batches.id')
            ->join('warehouse_stocks', 'stock_batches.warehouse_stock_id', '=', 'warehouse_stocks.id')
            ->join('products', 'warehouse_stocks.product_id', '=', 'products.id')
            ->leftJoin('product_prices', function ($join) {
                $join->on('products.id', '=', 'product_prices.product_id')
                    ->whereRaw('product_prices.effective_from <= stock_logs.created_at')
                    ->whereRaw('product_prices.effective_from = (SELECT MAX(effective_from) FROM product_prices WHERE product_id = products.id AND effective_from <= stock_logs.created_at)');
            })
            ->where('stock_logs.created_at', '>=', $sevenDaysAgo)
            ->where('stock_logs.qty', '<', 0)
            ->select('stock_logs.*', 'stock_batches.cost_price', 'product_prices.selling_price');

        if ($warehouseIds !== null) {
            $revenueQuery->whereIn('stock_logs.warehouse_id', $warehouseIds);
        }

        $totalRevenue = $revenueQuery->get()->sum(function ($log) {
            $sellingPrice = $log->selling_price ?? ($log->cost_price * 1.3);

            return abs($log->qty) * $sellingPrice;
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

        // Profit
        $profit = $totalRevenue - $totalCosts;
        $profitMargin = $totalRevenue > 0 ? ($profit / $totalRevenue) * 100 : 0;

        // Near Expiry Count (< 3 months)
        $threeMonthsFromNow = now()->addMonths(3);
        $nearExpiryCount = StockBatch::query()
            ->when($warehouseIds !== null, fn ($q) => $q->whereHas('warehouseStock', fn ($sq) => $sq->whereIn('warehouse_id', $warehouseIds)))
            ->whereNotNull('expired_at')
            ->where('expired_at', '<=', $threeMonthsFromNow)
            ->where('current_qty', '>', 0)
            ->count();

        // Stock Movement (Last 7 Days) - In vs Out
        $stockInQuery = StockLog::query()
            ->where('created_at', '>=', $sevenDaysAgo)
            ->where('qty', '>', 0);

        $stockOutQuery = StockLog::query()
            ->where('created_at', '>=', $sevenDaysAgo)
            ->where('qty', '<', 0);

        if ($warehouseIds !== null) {
            $stockInQuery->whereIn('warehouse_id', $warehouseIds);
            $stockOutQuery->whereIn('warehouse_id', $warehouseIds);
        }

        $stockIn = $stockInQuery->sum('qty');
        $stockOut = abs($stockOutQuery->sum('qty'));

        return [
            'financial' => [
                'revenue' => round($totalRevenue, 0),
                'costs' => round($totalCosts, 0),
                'profit' => round($profit, 0),
                'profitMargin' => round($profitMargin, 1),
            ],
            'nearExpiry' => [
                'count' => $nearExpiryCount,
            ],
            'stockMovement' => [
                'stockIn' => round($stockIn, 0),
                'stockOut' => round($stockOut, 0),
            ],
        ];
    }

    /**
     * Get stock aggregated by warehouse.
     */
    private function getStockByWarehouse(?array $warehouseIds): array
    {
        $query = DB::table('warehouses')
            ->join('warehouse_stocks', 'warehouses.id', '=', 'warehouse_stocks.warehouse_id')
            ->when($warehouseIds !== null, fn ($q) => $q->whereIn('warehouses.id', $warehouseIds))
            ->select(
                'warehouses.name',
                DB::raw('COUNT(DISTINCT warehouse_stocks.product_id) as total_items'),
                DB::raw('SUM(warehouse_stocks.total_quantity) as total_quantity')
            )
            ->groupBy('warehouses.id', 'warehouses.name')
            ->orderByDesc('total_quantity')
            ->get();

        return $query->map(fn ($item) => [
            'name' => $item->name,
            'items' => $item->total_items,
            'quantity' => $item->total_quantity,
        ])->toArray();
    }

    /**
     * Get top selling products (last 30 days).
     */
    private function getTopSellingProducts(?array $warehouseIds): array
    {
        $thirtyDaysAgo = now()->subDays(30);

        $query = StockLog::query()
            ->join('stock_batches', 'stock_logs.batch_id', '=', 'stock_batches.id')
            ->join('warehouse_stocks', 'stock_batches.warehouse_stock_id', '=', 'warehouse_stocks.id')
            ->join('products', 'warehouse_stocks.product_id', '=', 'products.id')
            ->where('stock_logs.created_at', '>=', $thirtyDaysAgo)
            ->where('stock_logs.qty', '<', 0) // Only stock out (sales)
            ->when($warehouseIds !== null, fn ($q) => $q->whereIn('stock_logs.warehouse_id', $warehouseIds))
            ->select(
                'products.name',
                'products.sku',
                DB::raw('SUM(ABS(stock_logs.qty)) as total_sold')
            )
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        return $query->map(fn ($item) => [
            'name' => $item->name,
            'sku' => $item->sku,
            'total' => (int) $item->total_sold,
        ])->toArray();
    }

    /**
     * Get revenue vs cost for last 7 days.
     */
    private function getRevenueVsCost(?array $warehouseIds): array
    {
        $sevenDaysAgo = now()->subDays(6)->startOfDay();

        $stockLogs = StockLog::query()
            ->join('stock_batches', 'stock_logs.batch_id', '=', 'stock_batches.id')
            ->join('warehouse_stocks', 'stock_batches.warehouse_stock_id', '=', 'warehouse_stocks.id')
            ->join('products', 'warehouse_stocks.product_id', '=', 'products.id')
            ->leftJoin('product_prices', function ($join) {
                $join->on('products.id', '=', 'product_prices.product_id')
                    ->whereRaw('product_prices.effective_from <= stock_logs.created_at')
                    ->whereRaw('product_prices.effective_from = (SELECT MAX(effective_from) FROM product_prices WHERE product_id = products.id AND effective_from <= stock_logs.created_at)');
            })
            ->when($warehouseIds !== null, fn ($q) => $q->whereIn('stock_logs.warehouse_id', $warehouseIds))
            ->where('stock_logs.created_at', '>=', $sevenDaysAgo)
            ->select([
                DB::raw('DATE(stock_logs.created_at) as date'),
                DB::raw('SUM(CASE WHEN stock_logs.qty > 0 THEN stock_logs.qty * stock_batches.cost_price ELSE 0 END) as costs'),
                DB::raw('SUM(CASE WHEN stock_logs.qty < 0 THEN ABS(stock_logs.qty) * COALESCE(product_prices.selling_price, stock_batches.cost_price * 1.3) ELSE 0 END) as revenue'),
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

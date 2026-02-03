<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockLog;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockLogController extends Controller
{
    /**
     * Display a listing of the stock logs (audit trail).
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', StockLog::class);

        $user = $request->user();
        $isSuperAdmin = $user?->hasRole('super-admin') ?? false;
        $isViewer = $user?->hasRole('viewer') ?? false;

        // Get assigned warehouse IDs for admin users
        $assignedWarehouseIds = ! $isSuperAdmin && ! $isViewer
            ? $user?->warehouses()->pluck('warehouses.id')->toArray() ?? []
            : [];

        $stockLogs = StockLog::query()
            ->with(['warehouse', 'product', 'user'])
            // Filter by assigned warehouses for admin users
            ->when(! $isSuperAdmin && ! $isViewer && ! empty($assignedWarehouseIds),
                fn ($query) => $query->whereIn('warehouse_id', $assignedWarehouseIds)
            )
            ->search($request->input('search'))
            ->when($request->input('warehouse'), fn ($query, $warehouseId) => $query->where('warehouse_id', $warehouseId))
            ->when($request->input('product'), fn ($query, $productId) => $query->where('product_id', $productId))
            ->when($request->input('user'), fn ($query, $userId) => $query->where('user_id', $userId))
            ->when($request->input('type'), fn ($query, $type) => $query->where('type', $type))
            ->when($request->input('date_from'), fn ($query, $dateFrom) => $query->whereDate('created_at', '>=', $dateFrom))
            ->when($request->input('date_to'), fn ($query, $dateTo) => $query->whereDate('created_at', '<=', $dateTo))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Get filter options - also filter warehouses for admin users
        $warehouses = $isSuperAdmin || $isViewer
            ? Warehouse::orderBy('name')->get(['id', 'name'])
            : Warehouse::whereIn('id', $assignedWarehouseIds)->orderBy('name')->get(['id', 'name']);
        $products = Product::orderBy('name')->get(['id', 'name', 'sku']);
        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('stock-logs/index', [
            'stockLogs' => $stockLogs,
            'warehouses' => $warehouses,
            'products' => $products,
            'users' => $users,
            'filters' => $request->only([
                'search',
                'warehouse',
                'product',
                'user',
                'type',
                'date_from',
                'date_to',
            ]),
        ]);
    }

    /**
     * Display the specified stock log.
     */
    public function show(StockLog $stockLog): Response
    {
        $this->authorize('view', $stockLog);

        $stockLog->load(['warehouse', 'product', 'user', 'batch']);

        return Inertia::render('stock-logs/show', [
            'stockLog' => $stockLog,
        ]);
    }
}

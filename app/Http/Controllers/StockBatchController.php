<?php

namespace App\Http\Controllers;

use App\Actions\StockBatches\CreateStockBatchAction;
use App\Actions\StockBatches\DeleteStockBatchAction;
use App\Actions\StockBatches\UpdateStockBatchAction;
use App\Http\Requests\StockBatches\StoreStockBatchRequest;
use App\Http\Requests\StockBatches\UpdateStockBatchRequest;
use App\Models\Product;
use App\Models\StockBatch;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockBatchController extends Controller
{
    /**
     * Display a listing of stock batches (FEFO monitoring).
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', StockBatch::class);

        $user = $request->user();
        $isSuperAdmin = $user->hasRole('super-admin');

        // Filter warehouses based on role
        $assignedWarehouseIds = $isSuperAdmin
            ? null
            : $user->warehouses()->pluck('warehouses.id')->toArray();

        $stockBatches = StockBatch::query()
            ->with(['warehouseStock.warehouse', 'warehouseStock.product'])
            // Filter by assigned warehouses for non-super-admin
            ->when(!$isSuperAdmin && $assignedWarehouseIds, function ($query) use ($assignedWarehouseIds) {
                $query->whereHas('warehouseStock', fn ($q) => $q->whereIn('warehouse_id', $assignedWarehouseIds));
            })
            ->search($request->input('search'))
            ->when($request->input('warehouse_id'), fn ($query, $warehouseId) => $query->whereHas('warehouseStock', fn ($q) => $q->where('warehouse_id', $warehouseId)))
            ->when($request->input('product_id'), fn ($query, $productId) => $query->whereHas('warehouseStock', fn ($q) => $q->where('product_id', $productId)))
            ->when($request->input('status'), fn ($query, $status) => $query->where('status', $status))
            ->when($request->boolean('near_expiry'), fn ($query) => $query->where('status', 'warning')->whereNotNull('expired_at'))
            ->when($request->boolean('is_active'), fn ($query) => $query->where('is_active', true))
            ->orderBy('expired_at', 'asc')
            ->orderBy('created_at', 'asc')
            ->paginate(15)
            ->withQueryString();

        // Filter warehouses list for non-super-admin
        $warehouses = $isSuperAdmin
            ? Warehouse::orderBy('name')->get(['id', 'name'])
            : $user->warehouses()->orderBy('name')->get(['id', 'name']);

        $products = Product::orderBy('name')->get(['id', 'name', 'sku', 'brand']);

        return Inertia::render('stock-batches/index', [
            'stockBatches' => $stockBatches,
            'warehouses' => $warehouses,
            'products' => $products,
            'filters' => $request->only([
                'search',
                'warehouse_id',
                'product_id',
                'status',
                'near_expiry',
                'is_active',
            ]),
        ]);
    }

    /**
     * Display the specified stock batch.
     */
    public function show(StockBatch $stockBatch): Response
    {
        $this->authorize('view', $stockBatch);

        $stockBatch->load(['warehouseStock.warehouse', 'warehouseStock.product', 'stockLogs.user']);

        return Inertia::render('stock-batches/show', [
            'stockBatch' => $stockBatch,
        ]);
    }

    /**
     * Store a newly created stock batch (via modal).
     * Auto-creates WarehouseStock if it doesn't exist.
     */
    public function store(StoreStockBatchRequest $request, CreateStockBatchAction $action)
    {
        $this->authorize('create', StockBatch::class);

        $batch = $action->execute($request->validated());

        session()->flash('success', 'Stock batch created successfully. Warehouse stock updated.');

        return redirect()->route('stock-batches.index');
    }

    /**
     * Update the specified stock batch (via modal).
     */
    public function update(UpdateStockBatchRequest $request, StockBatch $stockBatch, UpdateStockBatchAction $action)
    {
        $this->authorize('update', $stockBatch);

        $action->execute($stockBatch, $request->validated());

        session()->flash('success', 'Stock batch updated successfully. Warehouse stock recalculated.');

        return redirect()->route('stock-batches.index');
    }

    /**
     * Remove the specified stock batch.
     */
    public function destroy(StockBatch $stockBatch, DeleteStockBatchAction $action)
    {
        $this->authorize('delete', $stockBatch);

        $warehouseName = $stockBatch->warehouseStock->warehouse->name;
        $productName = $stockBatch->warehouseStock->product->name;

        $action->execute($stockBatch);

        session()->flash('success', "Stock batch deleted. Warehouse stock updated for {$warehouseName} - {$productName}.");

        return redirect()->route('stock-batches.index');
    }
}

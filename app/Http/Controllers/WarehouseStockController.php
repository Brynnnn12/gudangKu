<?php

namespace App\Http\Controllers;

use App\Actions\WarehouseStocks\BulkDeleteWarehouseStocksAction;
use App\Actions\WarehouseStocks\CreateWarehouseStockAction;
use App\Actions\WarehouseStocks\DeleteWarehouseStockAction;
use App\Actions\WarehouseStocks\StockOutAction;
use App\Actions\WarehouseStocks\UpdateWarehouseStockAction;
use App\Http\Requests\StockOutRequest;
use App\Http\Requests\WarehouseStocks\StoreWarehouseStockRequest;
use App\Http\Requests\WarehouseStocks\UpdateWarehouseStockRequest;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\WarehouseStock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseStockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', WarehouseStock::class);

        $warehouseStocks = WarehouseStock::query()
            ->with(['warehouse:id,name', 'product:id,name,sku,brand,unit'])
            // Filter gudang berdasarkan role (Security Logic)
            ->when(! $request->user()->hasRole('super-admin'), function ($query) use ($request) {
                $query->whereIn('warehouse_id', $request->user()->warehouses()->pluck('warehouse_id'));
            })
            // Filter Search (Clean Logic)
            ->search($request->search)
            // Filter by warehouse
            ->when($request->warehouse_id, fn ($query, $warehouseId) => $query->where('warehouse_id', $warehouseId))
            // Filter by product
            ->when($request->product_id, fn ($query, $productId) => $query->where('product_id', $productId))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('warehouse-stocks/index', [
            'warehouseStocks' => $warehouseStocks,
            'warehouses' => Warehouse::select('id', 'name')->get(),
            'products' => Product::select('id', 'name', 'sku', 'brand')->get(),
            'filters' => $request->only(['search', 'warehouse_id', 'product_id']),
        ]);
    }



    /**
     * Store a newly created resource in storage.
     * ⚠️ WarehouseStock cannot be created manually - use CreateStockBatchAction.
     */
    public function store(StoreWarehouseStockRequest $request, CreateWarehouseStockAction $action)
    {
        $this->authorize('create', WarehouseStock::class);

        // Prevent manual creation - guide users to use batch creation
        session()->flash('warning', 'Warehouse stocks cannot be created directly. Please create a stock batch instead.');

        return redirect()->route('warehouse-stocks.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(WarehouseStock $warehouseStock)
    {
        $this->authorize('view', $warehouseStock);

        $warehouseStock->load(['warehouse:id,name', 'product:id,name,sku,brand,unit']);

        return Inertia::render('warehouse-stocks/show', [
            'warehouseStock' => $warehouseStock,
        ]);
    }


    /**
     * Update the specified resource in storage.
     * ⚠️ WarehouseStock cannot be updated manually - use UpdateStockBatchAction.
     */
    public function update(UpdateWarehouseStockRequest $request, WarehouseStock $warehouseStock, UpdateWarehouseStockAction $action)
    {
        $this->authorize('update', $warehouseStock);

        // Prevent manual updates - guide users to use batch operations
        session()->flash('warning', 'Warehouse stock totals cannot be edited directly. Please update stock batches instead.');

        return redirect()->route('warehouse-stocks.index');
    }

    /**
     * Remove the specified resource from storage.
     * ⚠️ This will also DELETE ALL related batches!
     */
    public function destroy(WarehouseStock $warehouseStock, DeleteWarehouseStockAction $action)
    {
        $this->authorize('delete', $warehouseStock);

        $batchCount = $warehouseStock->batches()->count();

        $action->execute($warehouseStock);

        if ($batchCount > 0) {
            session()->flash('success', "Warehouse stock and {$batchCount} related batches deleted successfully.");
        } else {
            session()->flash('success', 'Warehouse stock deleted successfully.');
        }

        return redirect()->route('warehouse-stocks.index');
    }

    /**
     * Bulk delete warehouse stocks.
     */
    public function bulkDestroy(Request $request, BulkDeleteWarehouseStocksAction $action)
    {
        $this->authorize('viewAny', WarehouseStock::class);

        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:warehouse_stocks,id',
        ]);

        $action->execute($request->ids);

        $count = count($request->ids);

        session()->flash('success', "{$count} warehouse stocks deleted successfully.");

        return redirect()->route('warehouse-stocks.index');
    }

    /**
     * Stock out (reduce stock using FEFO method).
     */
    public function stockOut(StockOutRequest $request, WarehouseStock $warehouseStock, StockOutAction $action)
    {
        $this->authorize('update', $warehouseStock);

        try {
            $result = $action->execute(
                warehouseStockId: $warehouseStock->id,
                quantity: $request->validated('quantity'),
                type: $request->validated('type'),
                notes: $request->validated('notes')
            );

            $batchCount = count($result['affected_batches']);
            session()->flash('success', "Successfully reduced {$result['total_reduced']} units using FEFO. {$batchCount} batches affected.");

            return redirect()->route('warehouse-stocks.index');
        } catch (\InvalidArgumentException $e) {
            session()->flash('error', $e->getMessage());

            return redirect()->back();
        }
    }
}

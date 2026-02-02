<?php

namespace App\Http\Controllers;

use App\Actions\WarehouseStocks\BulkDeleteWarehouseStocksAction;
use App\Actions\WarehouseStocks\CreateWarehouseStockAction;
use App\Actions\WarehouseStocks\DeleteWarehouseStockAction;
use App\Actions\WarehouseStocks\UpdateWarehouseStockAction;
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
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('warehouse', fn ($w) => $w->where('name', 'like', "%{$search}%"))
                        ->orWhereHas(
                            'product',
                            fn ($p) => $p->where('name', 'like', "%{$search}%")
                                ->orWhere('sku', 'like', "%{$search}%")
                                ->orWhere('brand', 'like', "%{$search}%")
                        );
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('warehouse-stocks/index', [
            'warehouseStocks' => $warehouseStocks,
            'warehouses' => Warehouse::select('id', 'name')->get(),
            'products' => Product::select('id', 'name', 'sku', 'brand')->get(),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', WarehouseStock::class);

        return redirect()->route('warehouse-stocks.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWarehouseStockRequest $request, CreateWarehouseStockAction $action)
    {
        $this->authorize('create', WarehouseStock::class);

        $action->execute($request->validated());

        session()->flash('success', 'Warehouse stock created successfully.');

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
     * Show the form for editing the specified resource.
     */
    public function edit(WarehouseStock $warehouseStock)
    {
        $this->authorize('update', $warehouseStock);

        return redirect()->route('warehouse-stocks.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseStockRequest $request, WarehouseStock $warehouseStock, UpdateWarehouseStockAction $action)
    {
        $this->authorize('update', $warehouseStock);

        $action->execute($warehouseStock, $request->validated());

        session()->flash('success', 'Warehouse stock updated successfully.');

        return redirect()->route('warehouse-stocks.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WarehouseStock $warehouseStock, DeleteWarehouseStockAction $action)
    {
        $this->authorize('delete', $warehouseStock);

        $action->execute($warehouseStock);

        session()->flash('success', 'Warehouse stock deleted successfully.');

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
}

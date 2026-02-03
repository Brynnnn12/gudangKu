<?php

namespace App\Http\Controllers;

use App\Actions\Warehouses\BulkDeleteWarehousesAction;
use App\Actions\Warehouses\CreateWarehouseAction;
use App\Actions\Warehouses\DeleteWarehouseAction;
use App\Actions\Warehouses\UpdateWarehouseAction;
use App\Http\Requests\Warehouses\StoreWarehouseRequest;
use App\Http\Requests\Warehouses\UpdateWarehouseRequest;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Warehouse::class);

        $warehouses = Warehouse::query()
            ->search($request->search)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('warehouses/index', [
            'warehouses' => $warehouses,
            'filters' => $request->only(['search']),
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWarehouseRequest $request, CreateWarehouseAction $action)
    {
        $this->authorize('create', Warehouse::class);

        $action->execute($request->validated());

        session()->flash('success', 'Warehouse created successfully.');

        return redirect()->route('warehouses.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Warehouse $warehouse)
    {
        $this->authorize('view', $warehouse);

        return Inertia::render('warehouses/show', [
            'warehouse' => $warehouse,
        ]);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseRequest $request, Warehouse $warehouse, UpdateWarehouseAction $action)
    {
        $this->authorize('update', $warehouse);

        $action->execute($warehouse, $request->validated());

        session()->flash('success', 'Warehouse updated successfully.');

        return redirect()->route('warehouses.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Warehouse $warehouse, DeleteWarehouseAction $action)
    {
        $this->authorize('delete', $warehouse);

        try {
            $action->execute($warehouse);
            session()->flash('success', 'Warehouse deleted successfully.');
        } catch (\Exception $e) {
            session()->flash('error', $e->getMessage());
        }

        return redirect()->route('warehouses.index');
    }

    /**
     * Bulk delete warehouses.
     */
    public function bulkDestroy(Request $request, BulkDeleteWarehousesAction $action)
    {
        $this->authorize('bulkDelete', Warehouse::class);

        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:warehouses,id',
        ]);

        try {
            $count = $action->execute($request->ids);
            session()->flash('success', "{$count} warehouses deleted successfully.");
        } catch (\Exception $e) {
            session()->flash('error', $e->getMessage());
        }

        return redirect()->route('warehouses.index');
    }
}

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
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('warehouses/index', [
            'warehouses' => $warehouses,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Warehouse::class);

        return redirect()->route('warehouses.index');
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
     * Show the form for editing the specified resource.
     */
    public function edit(Warehouse $warehouse)
    {
        $this->authorize('update', $warehouse);

        return redirect()->route('warehouses.index');
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

        $action->execute($warehouse);

        session()->flash('success', 'Warehouse deleted successfully.');

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

        $count = $action->execute($request->ids);

        session()->flash('success', "{$count} warehouses deleted successfully.");

        return redirect()->route('warehouses.index');
    }
}

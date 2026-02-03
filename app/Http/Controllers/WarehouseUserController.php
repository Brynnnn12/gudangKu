<?php

namespace App\Http\Controllers;

use App\Actions\WarehouseUsers\BulkDeleteWarehouseUsersAction;
use App\Actions\WarehouseUsers\CreateWarehouseUserAction;
use App\Actions\WarehouseUsers\DeleteWarehouseUserAction;
use App\Actions\WarehouseUsers\UpdateWarehouseUserAction;
use App\Http\Requests\WarehouseUsers\StoreWarehouseUserRequest;
use App\Http\Requests\WarehouseUsers\UpdateWarehouseUserRequest;
use App\Models\User;
use App\Models\Warehouse;
use App\Models\WarehouseUser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', WarehouseUser::class);

        $warehouseUsers = WarehouseUser::query()
            ->with(['warehouse:id,name', 'user:id,name,email'])
            ->search($request->search)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $warehouses = Warehouse::select('id', 'name')->get();
        $users = User::role('admin')->select('id', 'name', 'email')->get();

        return Inertia::render('warehouse-users/index', [
            'warehouseUsers' => $warehouseUsers,
            'warehouses' => $warehouses,
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWarehouseUserRequest $request, CreateWarehouseUserAction $action)
    {
        $this->authorize('create', WarehouseUser::class);

        $action->execute($request->validated());

        return redirect()->route('warehouse-users.index')->with('success', 'Warehouse user created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(WarehouseUser $warehouseUser)
    {
        $this->authorize('view', $warehouseUser);

        $warehouseUser->load(['warehouse:id,name,address', 'user:id,name,email']);

        return Inertia::render('warehouse-users/show', [
            'warehouseUser' => $warehouseUser,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarehouseUserRequest $request, WarehouseUser $warehouseUser, UpdateWarehouseUserAction $action)
    {
        $this->authorize('update', $warehouseUser);

        $action->execute($warehouseUser, $request->validated());

        return redirect()->route('warehouse-users.index')->with('success', 'Warehouse user updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WarehouseUser $warehouseUser, DeleteWarehouseUserAction $action)
    {
        $this->authorize('delete', $warehouseUser);

        $action->execute($warehouseUser);

        return redirect()->route('warehouse-users.index')->with('success', 'Warehouse user deleted successfully.');
    }

    /**
     * Bulk delete warehouse users.
     */
    public function bulkDestroy(Request $request, BulkDeleteWarehouseUsersAction $action)
    {
        $this->authorize('bulkDelete', WarehouseUser::class);

        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:warehouse_users,id',
        ]);

        $count = $action->execute($request->ids);

        return redirect()->route('warehouse-users.index')->with('success', "{$count} warehouse users deleted successfully.");
    }
}

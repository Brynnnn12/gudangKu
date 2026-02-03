<?php

namespace App\Http\Controllers;

use App\Actions\Employee\BulkDeleteEmployeesAction;
use App\Actions\Employee\CreateEmployeeAction;
use App\Actions\Employee\DeleteEmployeeAction;
use App\Actions\Employee\UpdateEmployeeAction;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $employees = User::role(['admin', 'viewer'])
            ->with('roles')
            ->search($request->search)
            ->when($request->role && $request->role !== 'all', function ($query) use ($request) {
                $query->role($request->role);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(), // Mengambil string nama role saja
                'created_at' => $user->created_at->format('d M Y'),
            ]);

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'role']),
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeRequest $request, CreateEmployeeAction $action)
    {
        $action->execute($request->validated());

        session()->flash('success', 'Employee created successfully.');

        return redirect()->route('employees.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $employee)
    {
        $this->authorize('view', $employee);

        return Inertia::render('employees/show', [
            'employee' => $employee->load('roles'),
        ]);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeRequest $request, User $employee, UpdateEmployeeAction $action)
    {
        $action->execute($employee, $request->validated());

        session()->flash('success', 'Employee updated successfully.');

        return redirect()->route('employees.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $employee, DeleteEmployeeAction $action)
    {
        $this->authorize('delete', $employee);

        $action->execute($employee);

        session()->flash('success', 'Employee deleted successfully.');

        return redirect()->route('employees.index');
    }

    /**
     * Bulk delete employees.
     */
    public function bulkDestroy(Request $request, BulkDeleteEmployeesAction $action)
    {
        $this->authorize('bulkDelete', User::class);

        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:users,id',
        ]);

        $count = $action->execute($request->ids);

        session()->flash('success', "{$count} employees deleted successfully.");

        return redirect()->route('employees.index');
    }
}

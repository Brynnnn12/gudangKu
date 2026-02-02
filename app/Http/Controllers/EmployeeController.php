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

    $employees = User::role(['admin', 'user'])
        ->with('roles')
        ->when($request->search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        })
        ->when($request->role && $request->role !== 'all', function ($query) use ($request) {
            $query->role($request->role);
        })
        ->latest()
        ->paginate(10)
        ->withQueryString()
        // Tambahkan through untuk mapping data ke Frontend
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', User::class);

        return redirect()->route('employees.index');
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
     * Show the form for editing the specified resource.
     */
    public function edit(User $employee)
    {
        $this->authorize('update', $employee);

        return redirect()->route('employees.index');
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

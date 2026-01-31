<?php

namespace App\Http\Controllers;

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
            // Filter Search: Hanya jalan jika 'search' ada isinya
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            // Filter Role: Hanya jalan jika 'role' ada dan bukan 'all'
            ->when($request->role && $request->role !== 'all', function ($query) use ($request) {
                $query->role($request->role);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

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

        return Inertia::render('employees/create');
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

        return Inertia::render('employees/edit', [
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
}

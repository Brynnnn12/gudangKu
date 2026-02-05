<?php

namespace App\Http\Controllers;

use App\Actions\Categories\BulkDeleteCategoriesAction;
use App\Actions\Categories\CreateCategoryAction;
use App\Actions\Categories\DeleteCategoryAction;
use App\Actions\Categories\UpdateCategoryAction;
use App\Http\Requests\Categories\StoreCategoryRequest;
use App\Http\Requests\Categories\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Category::class);

        $categories = Category::query()
            ->search($request->search)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request, CreateCategoryAction $action)
    {
        $this->authorize('create', Category::class);

        $action->execute($request->validated());

        return redirect()->route('categories.index')->with('success', 'Kategori Berhasil Dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $this->authorize('view', $category);

        return Inertia::render('categories/show', [
            'category' => $category,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category, UpdateCategoryAction $action)
    {
        $this->authorize('update', $category);

        $action->execute($category, $request->validated());

        return redirect()->route('categories.index')->with('success', 'Kategori Berhasil Diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category, DeleteCategoryAction $action)
    {
        $this->authorize('delete', $category);

        try {
            $action->execute($category);

            return redirect()->route('categories.index')->with('success', 'Kategori Berhasil Dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('categories.index')->with('error', $e->getMessage());
        }
    }

    /**
     * Bulk delete categories.
     */
    public function bulkDestroy(Request $request, BulkDeleteCategoriesAction $action)
    {
        $this->authorize('bulkDelete', Category::class);

        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:categories,id',
        ]);

        try {
            $count = $action->execute($request->ids);

            return redirect()->route('categories.index')->with('success', "{$count} kategori berhasil dihapus.");
        } catch (\Exception $e) {
            return redirect()->route('categories.index')->with('error', $e->getMessage());
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Actions\Products\BulkDeleteProductsAction;
use App\Actions\Products\CreateProductAction;
use App\Actions\Products\DeleteProductAction;
use App\Actions\Products\UpdateProductAction;
use App\Http\Requests\Products\StoreProductRequest;
use App\Http\Requests\Products\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Product::class);

        $products = Product::query()
            ->with(['category:id,name'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhereHas('category', function ($category) use ($search) {
                            $category->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $categories = Category::select('id', 'name')->get();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Product::class);

        return redirect()->route('products.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request, CreateProductAction $action)
    {
        $this->authorize('create', Product::class);

        $action->execute($request->validated());

        session()->flash('success', 'Product created successfully.');

        return redirect()->route('products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $this->authorize('view', $product);

        $product->load(['category:id,name']);

        return Inertia::render('products/show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $this->authorize('update', $product);

        return redirect()->route('products.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product, UpdateProductAction $action)
    {
        $this->authorize('update', $product);

        $action->execute($product, $request->validated());

        session()->flash('success', 'Product updated successfully.');

        return redirect()->route('products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product, DeleteProductAction $action)
    {
        $this->authorize('delete', $product);

        $action->execute($product);

        session()->flash('success', 'Product deleted successfully.');

        return redirect()->route('products.index');
    }

    /**
     * Bulk delete products.
     */
    public function bulkDestroy(Request $request, BulkDeleteProductsAction $action)
    {
        $this->authorize('bulkDelete', Product::class);

        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:products,id',
        ]);

        $count = $action->execute($request->ids);

        session()->flash('success', "{$count} products deleted successfully.");

        return redirect()->route('products.index');
    }
}

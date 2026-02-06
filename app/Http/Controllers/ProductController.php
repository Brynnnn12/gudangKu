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
            ->search($request->search)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $categories = Category::select('id', 'name')->whereNull('deleted_at')->get();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request, CreateProductAction $action)
    {
        $this->authorize('create', Product::class);

        $action->execute($request->validated());

        return redirect()->route('products.index')->with('success', 'Produk berhasil dibuat.');
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
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product, UpdateProductAction $action)
    {
        $this->authorize('update', $product);

        $action->execute($product, $request->validated());

        return redirect()->route('products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product, DeleteProductAction $action)
    {
        $this->authorize('delete', $product);

        try {
            $action->execute($product);

            return redirect()->route('products.index')->with('success', 'Produk berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('products.index')->with('error', $e->getMessage());
        }
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

        try {
            $count = $action->execute($request->ids);

            return redirect()->route('products.index')->with('success', "Berhasil menghapus {$count} produk.");
        } catch (\Exception $e) {
            return redirect()->route('products.index')->with('error', $e->getMessage());
        }
    }
}

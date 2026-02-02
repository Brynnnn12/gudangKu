<?php

namespace App\Http\Controllers;

use App\Actions\Products\BulkDeleteProductPricesAction;
use App\Actions\Products\CreateProductPriceAction;
use App\Actions\Products\DeleteProductPriceAction;
use App\Actions\Products\UpdateProductPriceAction;
use App\Http\Requests\Products\StoreProductPriceRequest;
use App\Http\Requests\Products\UpdateProductPriceRequest;
use App\Models\Product;
use App\Models\ProductPrice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductPriceController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(ProductPrice::class, 'productPrice');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $productPrices = ProductPrice::with('product.category')
            ->when($request->search, function ($query, $search) {
                $query->whereHas('product', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%");
                });
            })
            ->when(
                $request->product_id,
                fn ($query, $productId) => $query->where('product_id', $productId)
            )
            ->orderBy('effective_from', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $products = Product::select('id', 'name', 'sku')
            ->orderBy('name')
            ->get();

        return Inertia::render('product-prices/index', [
            'productPrices' => $productPrices,
            'products' => $products,
            'filters' => $request->only(['search', 'product_id']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductPriceRequest $request, CreateProductPriceAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->back()->with('success', 'Harga produk berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateProductPriceRequest $request,
        ProductPrice $productPrice,
        UpdateProductPriceAction $action
    ): RedirectResponse {
        $action->execute($productPrice, $request->validated());

        return redirect()->back()->with('success', 'Harga produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductPrice $productPrice, DeleteProductPriceAction $action): RedirectResponse
    {
        $action->execute($productPrice);

        return redirect()->back()->with('success', 'Harga produk berhasil dihapus.');
    }

    /**
     * Bulk delete product prices.
     */
    public function bulkDestroy(Request $request, BulkDeleteProductPricesAction $action): RedirectResponse
    {
        $this->authorize('bulkDelete', ProductPrice::class);

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:product_prices,id',
        ]);

        $action->execute($request->input('ids'));

        return redirect()->back()->with('success', 'Harga produk berhasil dihapus.');
    }
}

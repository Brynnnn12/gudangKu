<?php

namespace App\Http\Controllers;

use App\Actions\StockTransfers\ApproveStockTransferAction;
use App\Actions\StockTransfers\CreateStockTransferAction;
use App\Actions\StockTransfers\DeleteStockTransferAction;
use App\Actions\StockTransfers\RejectStockTransferAction;
use App\Actions\StockTransfers\UpdateStockTransferAction;
use App\Http\Requests\StockTransfers\StoreStockTransferRequest;
use App\Http\Requests\StockTransfers\UpdateStockTransferRequest;
use App\Models\Product;
use App\Models\StockTransfer;
use App\Models\Warehouse;
use App\Models\WarehouseStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StockTransferController extends Controller
{
    /**
     * Display a listing of stock transfers.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', StockTransfer::class);

        $stockTransfers = StockTransfer::query()
            ->with(['fromWarehouse', 'toWarehouse', 'product', 'user'])
            ->search($request->input('search'))
            ->when($request->input('from_warehouse_id'), fn ($query, $warehouseId) => $query->where('from_warehouse_id', $warehouseId))
            ->when($request->input('to_warehouse_id'), fn ($query, $warehouseId) => $query->where('to_warehouse_id', $warehouseId))
            ->when($request->input('product_id'), fn ($query, $productId) => $query->where('product_id', $productId))
            ->when($request->input('status'), fn ($query, $status) => $query->where('status', $status))
            ->when($request->input('user_id'), fn ($query, $userId) => $query->where('user_id', $userId))
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $warehouses = Warehouse::whereNull('deleted_at')->orderBy('name')->get(['id', 'name']);
        $products = Product::whereNull('deleted_at')->orderBy('name')->get(['id', 'name', 'sku', 'brand', 'unit']);
        $warehouseStocks = WarehouseStock::with(['warehouse', 'product'])
            ->where('total_quantity', '>', 0)
            ->get();

        return Inertia::render('stock-transfers/index', [
            'stockTransfers' => $stockTransfers,
            'warehouses' => $warehouses,
            'products' => $products,
            'warehouseStocks' => $warehouseStocks,
            'user' => Auth::user()->load('warehouses'),
            'filters' => $request->only([
                'search',
                'from_warehouse_id',
                'to_warehouse_id',
                'product_id',
                'status',
                'user_id',
            ]),
        ]);
    }

    /**
     * Store a newly created stock transfer.
     */
    public function store(StoreStockTransferRequest $request, CreateStockTransferAction $action)
    {
        $this->authorize('create', StockTransfer::class);

        $transfer = $action->execute($request->validated());

        return redirect()->route('stock-transfers.index')->with('success', 'Stock berhasil dikirim.');
    }

    /**
     * Update the specified stock transfer.
     */
    public function update(UpdateStockTransferRequest $request, StockTransfer $stockTransfer, UpdateStockTransferAction $action)
    {
        $this->authorize('update', $stockTransfer);

        try {
            $transfer = $action->execute($stockTransfer, $request->validated());

            return redirect()->route('stock-transfers.index')->with('success', 'Stock transfer updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified stock transfer.
     */
    public function destroy(StockTransfer $stockTransfer, DeleteStockTransferAction $action)
    {
        $this->authorize('delete', $stockTransfer);

        try {
            $action->execute($stockTransfer);

            return redirect()->route('stock-transfers.index')->with('success', 'Stock transfer deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Approve and execute the stock transfer.
     */
    public function approve(StockTransfer $stockTransfer, ApproveStockTransferAction $action)
    {
        $this->authorize('approve', $stockTransfer);

        try {
            $transfer = $action->execute($stockTransfer);

            return redirect()->route('stock-transfers.index')->with('success', 'Stock transfer approved and completed successfully. Stock has been moved between warehouses.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Reject the stock transfer.
     */
    public function reject(Request $request, StockTransfer $stockTransfer, RejectStockTransferAction $action)
    {
        $this->authorize('reject', $stockTransfer);

        $request->validate([
            'reject_reason' => ['nullable', 'string', 'max:500'],
        ]);

        try {
            $transfer = $action->execute($stockTransfer, $request->input('reject_reason'));

            return redirect()->route('stock-transfers.index')->with('success', 'Stock transfer rejected.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}

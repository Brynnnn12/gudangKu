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
use Illuminate\Http\Request;
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
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('fromWarehouse', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('toWarehouse', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('product', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                        ->orWhere('notes', 'like', "%{$search}%");
                });
            })
            ->when($request->input('from_warehouse_id'), fn ($query, $warehouseId) => $query->where('from_warehouse_id', $warehouseId))
            ->when($request->input('to_warehouse_id'), fn ($query, $warehouseId) => $query->where('to_warehouse_id', $warehouseId))
            ->when($request->input('product_id'), fn ($query, $productId) => $query->where('product_id', $productId))
            ->when($request->input('status'), fn ($query, $status) => $query->where('status', $status))
            ->when($request->input('user_id'), fn ($query, $userId) => $query->where('user_id', $userId))
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $warehouses = Warehouse::orderBy('name')->get(['id', 'name']);
        $products = Product::orderBy('name')->get(['id', 'name', 'sku', 'brand']);

        return Inertia::render('stock-transfers/index', [
            'stockTransfers' => $stockTransfers,
            'warehouses' => $warehouses,
            'products' => $products,
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
     * Show the form for creating a new stock transfer.
     */
    public function create(): Response
    {
        $this->authorize('create', StockTransfer::class);

        $warehouses = Warehouse::orderBy('name')->get(['id', 'name']);
        $products = Product::orderBy('name')->get(['id', 'name', 'sku', 'brand']);

        return Inertia::render('stock-transfers/create', [
            'warehouses' => $warehouses,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created stock transfer.
     */
    public function store(StoreStockTransferRequest $request, CreateStockTransferAction $action)
    {
        $this->authorize('create', StockTransfer::class);

        $transfer = $action->execute($request->validated());

        session()->flash('success', 'Stock transfer request created successfully. Awaiting approval.');

        return redirect()->route('stock-transfers.show', $transfer);
    }

    /**
     * Display the specified stock transfer.
     */
    public function show(StockTransfer $stockTransfer): Response
    {
        $this->authorize('view', $stockTransfer);

        $stockTransfer->load(['fromWarehouse', 'toWarehouse', 'product', 'user']);

        return Inertia::render('stock-transfers/show', [
            'stockTransfer' => $stockTransfer,
            'canUpdate' => auth()->user()->can('update', $stockTransfer),
            'canDelete' => auth()->user()->can('delete', $stockTransfer),
            'canApprove' => auth()->user()->can('approve', $stockTransfer),
            'canReject' => auth()->user()->can('reject', $stockTransfer),
        ]);
    }

    /**
     * Show the form for editing the specified stock transfer.
     */
    public function edit(StockTransfer $stockTransfer): Response
    {
        $this->authorize('update', $stockTransfer);

        $stockTransfer->load(['fromWarehouse', 'toWarehouse', 'product', 'user']);

        $warehouses = Warehouse::orderBy('name')->get(['id', 'name']);
        $products = Product::orderBy('name')->get(['id', 'name', 'sku', 'brand']);

        return Inertia::render('stock-transfers/edit', [
            'stockTransfer' => $stockTransfer,
            'warehouses' => $warehouses,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified stock transfer.
     */
    public function update(UpdateStockTransferRequest $request, StockTransfer $stockTransfer, UpdateStockTransferAction $action)
    {
        $this->authorize('update', $stockTransfer);

        try {
            $transfer = $action->execute($stockTransfer, $request->validated());

            session()->flash('success', 'Stock transfer updated successfully.');

            return redirect()->route('stock-transfers.show', $transfer);
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

            session()->flash('success', 'Stock transfer deleted successfully.');

            return redirect()->route('stock-transfers.index');
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

            session()->flash('success', 'Stock transfer approved and completed successfully. Stock has been moved between warehouses.');

            return redirect()->route('stock-transfers.show', $transfer);
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

            session()->flash('success', 'Stock transfer rejected.');

            return redirect()->route('stock-transfers.show', $transfer);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}

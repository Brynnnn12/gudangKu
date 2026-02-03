<?php

namespace App\Http\Controllers;

use App\Actions\StockBatches\CreateStockBatchAction;
use App\Http\Requests\StockBatches\StoreStockBatchRequest;
use Illuminate\Http\RedirectResponse;

class StockBatchController extends Controller
{
    /**
     * Store a newly created stock batch.
     * This will auto-create/update WarehouseStock.
     */
    public function store(StoreStockBatchRequest $request, CreateStockBatchAction $action): RedirectResponse
    {
        $this->authorize('create', \App\Models\StockBatch::class);

        $action->execute($request->validated());

        return redirect()->back()->with('success', 'Batch stok berhasil ditambahkan. Total stok gudang telah diperbarui.');
    }
}

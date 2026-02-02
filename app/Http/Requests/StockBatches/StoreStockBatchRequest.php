<?php

namespace App\Http\Requests\StockBatches;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockBatchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled in controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'batch_number' => ['required', 'string', 'max:50', 'unique:stock_batches,batch_number'],
            'expired_at' => ['nullable', 'date', 'after:today'],
            'current_qty' => ['required', 'integer', 'min:1'],
            'cost_price' => ['required', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'warehouse_id.required' => 'Gudang wajib diisi.',
            'warehouse_id.exists' => 'Gudang yang dipilih tidak ada.',
            'product_id.required' => 'Produk wajib diisi.',
            'product_id.exists' => 'Produk yang dipilih tidak ada.',
            'batch_number.required' => 'Nomor batch wajib diisi.',
            'batch_number.unique' => 'Nomor batch ini sudah ada.',
            'expired_at.after' => 'Tanggal kedaluwarsa harus setelah hari ini.',
            'current_qty.required' => 'Kuantitas wajib diisi.',
            'current_qty.min' => 'Kuantitas harus minimal 1.',
            'cost_price.required' => 'Harga pokok wajib diisi.',
            'cost_price.min' => 'Harga pokok harus minimal 0.',
        ];
    }
}

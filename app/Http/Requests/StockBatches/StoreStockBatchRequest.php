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
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id', 'min:1', 'max:2147483647'],
            'product_id' => ['required', 'integer', 'exists:products,id', 'min:1', 'max:2147483647'],
            'batch_number' => ['required', 'string', 'max:50', 'unique:stock_batches,batch_number', 'regex:/^[A-Z0-9\-\/]+$/i'],
            'expired_at' => ['nullable', 'date', 'date_format:Y-m-d', 'after:today', 'before:'.now()->addYears(50)->format('Y-m-d')],
            'current_qty' => ['required', 'integer', 'min:1', 'max:1000000'],
            'cost_price' => ['required', 'numeric', 'min:0', 'max:999999999999.99', 'regex:/^\d+(\.\d{1,2})?$/'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('batch_number')) {
            $this->merge([
                'batch_number' => strtoupper(strip_tags($this->batch_number)),
            ]);
        }
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

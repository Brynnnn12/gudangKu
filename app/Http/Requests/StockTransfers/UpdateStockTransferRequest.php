<?php

namespace App\Http\Requests\StockTransfers;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStockTransferRequest extends FormRequest
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
            'from_warehouse_id' => [
                'required',
                'integer',
                'exists:warehouses,id',
                'different:to_warehouse_id',
            ],
            'to_warehouse_id' => [
                'required',
                'integer',
                'exists:warehouses,id',
                'different:from_warehouse_id',
            ],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'qty' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'from_warehouse_id.required' => 'Gudang asal wajib diisi.',
            'from_warehouse_id.exists' => 'Gudang asal yang dipilih tidak ada.',
            'from_warehouse_id.different' => 'Gudang asal dan tujuan tidak boleh sama.',
            'to_warehouse_id.required' => 'Gudang tujuan wajib diisi.',
            'to_warehouse_id.exists' => 'Gudang tujuan yang dipilih tidak ada.',
            'to_warehouse_id.different' => 'Gudang tujuan dan asal tidak boleh sama.',
            'product_id.required' => 'Produk wajib diisi.',
            'product_id.exists' => 'Produk yang dipilih tidak ada.',
            'qty.required' => 'Kuantitas wajib diisi.',
            'qty.min' => 'Kuantitas harus minimal 1.',
            'notes.max' => 'Catatan maksimal 1000 karakter.',
        ];
    }
}

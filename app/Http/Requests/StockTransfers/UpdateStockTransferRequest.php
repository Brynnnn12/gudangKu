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
                'min:1',
                'max:2147483647',
            ],
            'to_warehouse_id' => [
                'required',
                'integer',
                'exists:warehouses,id',
                'different:from_warehouse_id',
                'min:1',
                'max:2147483647',
            ],
            'product_id' => ['required', 'integer', 'exists:products,id', 'min:1', 'max:2147483647'],
            'qty' => ['required', 'integer', 'min:1', 'max:1000000'],
            'notes' => ['nullable', 'string', 'max:1000', 'regex:/^[\p{L}\p{N}\s\.,\-\/()]*$/u'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('notes')) {
            $this->merge([
                'notes' => strip_tags($this->notes),
            ]);
        }
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

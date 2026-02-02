<?php

namespace App\Http\Requests\WarehouseStocks;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWarehouseStockRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'warehouse_id' => [
                'required',
                'integer',
                'exists:warehouses,id',
            ],
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
                Rule::unique('warehouse_stocks')->where(function ($query) {
                    return $query->where('warehouse_id', $this->warehouse_id);
                }),
            ],
            'total_quantity' => [
                'required',
                'integer',
                'min:0',
            ],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'warehouse_id.required' => 'Gudang wajib diisi.',
            'warehouse_id.exists' => 'Gudang yang dipilih tidak ada.',
            'product_id.required' => 'Produk wajib diisi.',
            'product_id.exists' => 'Produk yang dipilih tidak ada.',
            'product_id.unique' => 'Produk ini sudah ada di gudang yang dipilih.',
            'total_quantity.required' => 'Jumlah total wajib diisi.',
            'total_quantity.min' => 'Jumlah total harus minimal 0.',
        ];
    }
}

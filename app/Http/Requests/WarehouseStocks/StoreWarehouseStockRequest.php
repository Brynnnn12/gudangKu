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
            'warehouse_id.required' => 'Warehouse is required.',
            'warehouse_id.exists' => 'The selected warehouse does not exist.',
            'product_id.required' => 'Product is required.',
            'product_id.exists' => 'The selected product does not exist.',
            'product_id.unique' => 'This product already exists in the selected warehouse.',
            'total_quantity.required' => 'Total quantity is required.',
            'total_quantity.min' => 'Total quantity must be at least 0.',
        ];
    }
}

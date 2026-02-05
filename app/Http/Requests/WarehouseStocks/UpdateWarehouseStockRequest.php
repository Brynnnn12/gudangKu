<?php

namespace App\Http\Requests\WarehouseStocks;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWarehouseStockRequest extends FormRequest
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
            'total_quantity' => [
                'required',
                'integer',
                'min:0',
                'max:2147483647',
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
            'total_quantity.required' => 'Total kuantitas wajib diisi.',
            'total_quantity.min' => 'Total kuantitas harus minimal 0.',
        ];
    }
}

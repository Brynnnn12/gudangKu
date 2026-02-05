<?php

namespace App\Http\Requests\StockBatches;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStockBatchRequest extends FormRequest
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
            'expired_at' => ['nullable', 'date', 'date_format:Y-m-d', 'after_or_equal:today', 'before:'.now()->addYears(50)->format('Y-m-d')],
            'current_qty' => ['required', 'integer', 'min:0', 'max:1000000'], // Can be 0 for depleted batches
            'cost_price' => ['required', 'numeric', 'min:0', 'max:999999999999.99', 'regex:/^\d+(\.\d{1,2})?$/'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    // pakai bahasa indo
    public function messages(): array
    {
        return [
            'current_qty.required' => 'Kuantitas wajib diisi.',
            'current_qty.min' => 'Kuantitas tidak boleh negatif.',
            'cost_price.required' => 'Harga pokok wajib diisi.',
            'cost_price.min' => 'Harga pokok tidak boleh negatif.',
        ];
    }
}

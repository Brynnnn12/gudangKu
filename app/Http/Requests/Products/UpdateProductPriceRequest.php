<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductPriceRequest extends FormRequest
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
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],
            'cost_price' => [
                'required',
                'numeric',
                'min:0',
                'max:999999999999.99',
            ],
            'selling_price' => [
                'required',
                'numeric',
                'min:0',
                'max:999999999999.99',
                'gte:cost_price',
            ],
            'effective_from' => [
                'required',
                'date',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Produk wajib dipilih.',
            'product_id.exists' => 'Produk yang dipilih tidak ditemukan.',
            'cost_price.required' => 'Harga modal wajib diisi.',
            'cost_price.numeric' => 'Harga modal harus berupa angka.',
            'cost_price.min' => 'Harga modal tidak boleh kurang dari 0.',
            'cost_price.max' => 'Harga modal terlalu besar.',
            'selling_price.required' => 'Harga jual wajib diisi.',
            'selling_price.numeric' => 'Harga jual harus berupa angka.',
            'selling_price.min' => 'Harga jual tidak boleh kurang dari 0.',
            'selling_price.max' => 'Harga jual terlalu besar.',
            'selling_price.gte' => 'Harga jual harus lebih besar atau sama dengan harga modal.',
            'effective_from.required' => 'Tanggal efektif wajib diisi.',
            'effective_from.date' => 'Tanggal efektif tidak valid.',
        ];
    }
}

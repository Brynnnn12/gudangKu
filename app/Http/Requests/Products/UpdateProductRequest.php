<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
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
        $productId = $this->route('product')->id;

        return [
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'brand' => [
                'required',
                'string',
                'max:100',
            ],
            'unit' => [
                'required',
                'string',
                Rule::in(['Karton', 'Box', 'Pcs', 'Liter', 'Kg', 'Meter', 'Buah', 'Lusin', 'Pack']),
            ],

        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak ditemukan.',
            'name.required' => 'Nama produk wajib diisi.',
            'name.max' => 'Nama produk tidak boleh lebih dari 255 karakter.',
            'brand.required' => 'Merek produk wajib diisi.',
            'brand.max' => 'Merek tidak boleh lebih dari 100 karakter.',
            'unit.required' => 'Satuan wajib dipilih.',
            'unit.in' => 'Satuan harus salah satu dari: Karton, Box, Pcs, Liter, Kg, Meter, Buah, Lusin, Pack.',
        ];
    }
}

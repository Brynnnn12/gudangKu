<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => strip_tags(trim($this->name)),
            'brand' => strip_tags(trim($this->brand)),
        ]);
    }

    public function rules(): array
    {
        // Pastikan route model binding sudah benar di Controller agar ini tidak error
        $productId = $this->route('product')->id ?? $this->route('product');

        return [
            'category_id' => [
                'sometimes', // Gunakan sometimes agar bisa update parsial
                'required',
                'integer',
                'exists:categories,id',
            ],
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                // Mencegah karakter aneh masuk ke DB
                'regex:/^[a-zA-Z0-9\s\-\.\(\)]+$/',
            ],
            'brand' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],
            'unit' => [
                'sometimes',
                'required',
                'string',
                Rule::in(['Karton', 'Box', 'Pcs', 'Liter', 'Kg', 'Meter', 'Buah', 'Lusin', 'Pack']),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori produk wajib diisi.',
            'category_id.integer' => 'Kategori produk tidak valid.',
            'category_id.exists' => 'Kategori produk tidak ditemukan.',

            'name.required' => 'Nama produk wajib diisi.',
            'name.string' => 'Nama produk harus berupa teks.',
            'name.max' => 'Nama produk tidak boleh lebih dari 255 karakter.',
            'name.regex' => 'Nama produk hanya boleh mengandung huruf, angka, spasi, tanda hubung (-), titik (.), dan tanda kurung ().',

            'brand.required' => 'Merek produk wajib diisi.',
            'brand.string' => 'Merek produk harus berupa teks.',
            'brand.max' => 'Merek produk tidak boleh lebih dari 100 karakter.',

            'unit.required' => 'Satuan produk wajib diisi.',
            'unit.string' => 'Satuan produk harus berupa teks.',
            'unit.in' => 'Satuan produk tidak valid. Pilih salah satu dari: Karton, Box, Pcs, Liter, Kg, Meter, Buah, Lusin, Pack.',
        ];
    }
}

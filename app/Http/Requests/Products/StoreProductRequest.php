<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            // Bersihkan nama dan brand dari potensi XSS
            'name' => strip_tags(trim($this->name)),
            'brand' => strip_tags(trim($this->brand)),
            // Bersihkan angka dari format ribuan (titik/koma)
            'selling_price' => $this->cleanNumber($this->selling_price),
            'cost_price' => $this->cleanNumber($this->cost_price),
        ]);
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|integer|exists:categories,id',
            'name' => [
                'required',
                'string',
                'max:255',
                // Pastikan tidak ada karakter aneh untuk keamanan database
                'regex:/^[a-zA-Z0-9\s\-\.\(\)]+$/',
            ],
            'brand' => 'required|string|max:100',
            'unit' => [
                'required',
                Rule::in(['Karton', 'Box', 'Pcs', 'Liter', 'Kg', 'Meter', 'Buah', 'Lusin', 'Pack']),
            ],
            'selling_price' => 'required|numeric|min:0',
            'cost_price' => [
                'required',
                'numeric',
                'min:0',
                // 'lt' (Less Than) sudah bagus, memastikan harga modal < harga jual
                'lt:selling_price',
            ],
        ];
    }

    private function cleanNumber($value)
    {
        return is_string($value) ? str_replace(['.', ','], '', $value) : $value;
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
            'name.regex' => 'Nama produk hanya boleh mengandung huruf, angka, spasi, dan tanda hubung (-), titik, atau kurung.',
            'brand.required' => 'Merek produk wajib diisi.',
            'brand.string' => 'Merek produk harus berupa teks.',
            'brand.max' => 'Merek produk tidak boleh lebih dari 100 karakter.',
            'unit.required' => 'Satuan produk wajib dipilih.',
            'unit.in' => 'Satuan produk tidak valid.',
            'selling_price.required' => 'Harga jual wajib diisi.',
            'selling_price.numeric' => 'Harga jual harus berupa angka.',
            'selling_price.min' => 'Harga jual tidak boleh kurang dari 0.',
            'cost_price.required' => 'Harga modal wajib diisi.',
            'cost_price.numeric' => 'Harga modal harus berupa angka.',
            'cost_price.min' => 'Harga modal tidak boleh kurang dari 0.',
            'cost_price.lt' => 'Harga modal harus lebih kecil dari harga jual.',
        ];
    }
}

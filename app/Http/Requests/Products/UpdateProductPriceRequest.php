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

    protected function prepareForValidation(): void
    {
        // Sanitasi input angka jika user input pakai titik/koma (misal: 10.000)
        $this->merge([
            'cost_price' => $this->has('cost_price') ? $this->cleanNumber($this->cost_price) : null,
            'selling_price' => $this->has('selling_price') ? $this->cleanNumber($this->selling_price) : null,
        ]);
    }

    public function rules(): array
    {
        return [
            // Pakai 'sometimes' agar jika hanya mau update harga jual saja tidak error
            'product_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:products,id',
            ],
            'cost_price' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
                'max:999999999999.99',
            ],
            'selling_price' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
                'max:999999999999.99',
                // Logika bisnis: Harga jual tetap harus lebih besar dari modal saat ini
                'gte:cost_price',
            ],
            'effective_from' => [
                'sometimes',
                'required',
                'date',
                'after_or_equal:today', // Opsional: mencegah input tanggal masa lalu
            ],
        ];
    }

    /**
     * Membersihkan format angka dari pemisah ribuan
     */
    private function cleanNumber($value)
    {
        return is_string($value) ? str_replace(['.', ','], '', $value) : $value;
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
            'effective_from.after_or_equal' => 'Tanggal efektif tidak boleh sebelum hari ini.',
        ];
    }
}

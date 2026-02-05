<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductPriceRequest extends FormRequest
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
        // Menghapus karakter non-numerik jika user input format ribuan (misal: 10.000)
        // Ini mencegah error numeric saat validasi dijalankan
        $this->merge([
            'cost_price' => $this->cleanNumber($this->cost_price),
            'selling_price' => $this->cleanNumber($this->selling_price),
            // Pastikan tidak ada tag di input tanggal (antisipasi tampering)
            'effective_from' => strip_tags($this->effective_from),
        ]);
    }

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
                'gte:cost_price', // Mantap, ini mencegah kerugian!
            ],
            'effective_from' => [
                'required',
                'date',
                'after_or_equal:today', // Opsional: mencegah input tanggal masa lalu
            ],
        ];
    }

    /**
     * Helper untuk membersihkan input harga dari format ribuan/titik
     */
    private function cleanNumber($value)
    {
        if (is_string($value)) {
            return str_replace(['.', ','], '', $value);
        }

        return $value;
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

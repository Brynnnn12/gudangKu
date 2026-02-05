<?php

namespace App\Http\Requests\Warehouses;

use Illuminate\Foundation\Http\FormRequest;

class StoreWarehouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            // Strip tags untuk mencegah XSS (script injection)
            'name' => strip_tags(trim($this->name)),
            // Khusus alamat, kita gunakan strip_tags tapi tetap izinkan karakter umum alamat
            'address' => strip_tags(trim($this->address)),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z0-9\s\-]+$/', // Hanya huruf, angka, spasi, dash
            ],
            'address' => [
                'required',
                'string',
                'min:10', // Alamat biasanya panjang, cegah input asal-asalan
                'max:500',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama gudang wajib diisi.',
            'name.string' => 'Nama gudang harus berupa teks.',
            'name.max' => 'Nama gudang maksimal 50 karakter.',
            'name.regex' => 'Nama gudang hanya boleh berisi huruf, angka, spasi, dan tanda hubung.',

            'address.required' => 'Alamat gudang wajib diisi.',
            'address.string' => 'Alamat gudang harus berupa teks.',
            'address.min' => 'Alamat gudang terlalu pendek (minimal 10 karakter).',
            'address.max' => 'Alamat gudang terlalu panjang.',
        ];
    }
}

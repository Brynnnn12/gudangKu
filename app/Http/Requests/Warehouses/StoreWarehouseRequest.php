<?php

namespace App\Http\Requests\Warehouses;

use Illuminate\Foundation\Http\FormRequest;

class StoreWarehouseRequest extends FormRequest
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
            'name' => 'required|string|max:50',
            'address' => 'required|string',
        ];
    }

    // pakai bahasa indonesia di pesan errornya
    public function messages(): array
    {
        return [
            'name.required' => 'Nama gudang wajib diisi.',
            'name.string' => 'Nama gudang harus berupa teks.',
            'name.max' => 'Nama gudang tidak boleh lebih dari 50 karakter.',
            'address.required' => 'Alamat gudang wajib diisi.',
            'address.string' => 'Alamat gudang harus berupa teks.',
        ];
    }
}

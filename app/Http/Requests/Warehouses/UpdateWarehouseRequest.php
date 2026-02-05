<?php

namespace App\Http\Requests\Warehouses;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWarehouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('name')) {
            $this->merge(['name' => strip_tags(trim($this->name))]);
        }
        if ($this->has('address')) {
            $this->merge(['address' => strip_tags(trim($this->address))]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:50|regex:/^[a-zA-Z0-9\s\-]+$/',
            'address' => 'sometimes|required|string|min:10',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama gudang tidak boleh dikosongkan.',
            'name.string' => 'Nama gudang harus berupa teks.',
            'name.max' => 'Nama gudang maksimal 50 karakter.',
            'name.regex' => 'Nama gudang hanya boleh berisi huruf, angka, spasi, dan tanda hubung.',

            'address.required' => 'Alamat gudang tidak boleh dikosongkan.',
            'address.string' => 'Alamat gudang harus berupa teks.',
            'address.min' => 'Alamat gudang minimal 10 karakter.',
        ];
    }
}

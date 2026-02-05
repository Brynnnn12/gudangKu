<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockOutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by controller policy
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id', 'min:1', 'max:2147483647'],
            'product_id' => ['required', 'integer', 'exists:products,id', 'min:1', 'max:2147483647'],
            'quantity' => ['required', 'integer', 'min:1', 'max:1000000'],
            'type' => ['required', 'string', 'in:exit,damage', 'regex:/^(exit|damage)$/'],
            'notes' => ['nullable', 'string', 'max:500', 'regex:/^[\p{L}\p{N}\s\.,\-\/()]*$/u'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        if ($this->has('notes')) {
            $data['notes'] = strip_tags($this->notes);
        }

        if (! empty($data)) {
            $this->merge($data);
        }
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'warehouse_id.required' => 'Gudang wajib dipilih.',
            'warehouse_id.exists' => 'Gudang tidak ditemukan.',
            'product_id.required' => 'Produk wajib dipilih.',
            'product_id.exists' => 'Produk tidak ditemukan.',
            'quantity.required' => 'Jumlah barang wajib diisi.',
            'quantity.integer' => 'Jumlah barang harus berupa angka.',
            'quantity.min' => 'Jumlah barang minimal 1.',
            'type.required' => 'Tipe stock out wajib dipilih.',
            'type.in' => 'Tipe stock out harus exit atau damage.',
            'notes.max' => 'Catatan maksimal 500 karakter.',
        ];
    }
}

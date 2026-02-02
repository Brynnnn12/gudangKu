<?php

namespace App\Http\Requests\WarehouseUsers;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWarehouseUserRequest extends FormRequest
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
            'warehouse_id' => [
                'required',
                'integer',
                'exists:warehouses,id',
            ],
            'user_id' => [
                'required',
                'integer',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    $user = \App\Models\User::find($value);
                    if ($user && ! $user->hasRole('admin')) {
                        $fail('Pengguna yang dipilih harus memiliki role Admin.');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'warehouse_id.required' => 'Gudang wajib dipilih.',
            'warehouse_id.integer' => 'Gudang harus berupa angka.',
            'warehouse_id.exists' => 'Gudang yang dipilih tidak ditemukan.',
            'user_id.required' => 'Pengguna wajib dipilih.',
            'user_id.integer' => 'Pengguna harus berupa angka.',
            'user_id.exists' => 'Pengguna yang dipilih tidak ditemukan.',
        ];
    }
}

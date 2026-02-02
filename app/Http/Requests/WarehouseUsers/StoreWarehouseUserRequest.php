<?php

namespace App\Http\Requests\WarehouseUsers;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWarehouseUserRequest extends FormRequest
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
                Rule::unique('warehouse_users', 'warehouse_id')
                    ->whereNull('deleted_at'),
            ],
            'user_id' => [
                'required',
                'integer',
                'exists:users,id',
                Rule::unique('warehouse_users', 'user_id')
                    ->whereNull('deleted_at'),
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
            'warehouse_id.unique' => 'Gudang ini sudah dikelola oleh pengguna lain.',
            'user_id.required' => 'Pengguna wajib dipilih.',
            'user_id.integer' => 'Pengguna harus berupa angka.',
            'user_id.exists' => 'Pengguna yang dipilih tidak ditemukan.',
            'user_id.unique' => 'Pengguna ini sudah ditugaskan ke gudang lain. Satu pengguna hanya bisa mengelola satu gudang.',
        ];
    }
}

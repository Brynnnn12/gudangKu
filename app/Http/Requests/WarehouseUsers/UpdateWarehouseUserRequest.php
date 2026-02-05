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
                'min:1',
                'max:2147483647',
            ],
            'user_id' => [
                'required',
                'integer',
                'exists:users,id',
                'min:1',
                'max:2147483647',
                // No unique validation needed since user field is readonly in edit mode
                function ($attribute, $value, $fail) {
                    if (! is_numeric($value) || $value != (int) $value) {
                        $fail('ID pengguna tidak valid.');

                        return;
                    }
                    $user = \App\Models\User::find($value);
                    if ($user && ! $user->hasRole('admin')) {
                        $fail('Pengguna yang dipilih harus memiliki role Admin.');
                    }
                },
            ],
            'start_date' => [
                'required',
                'date',
                'date_format:Y-m-d',
                'after_or_equal:2000-01-01',
                'before_or_equal:'.now()->addYears(10)->format('Y-m-d'),
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
            'user_id.unique' => 'Pengguna ini sudah ditugaskan ke gudang lain. Satu pengguna hanya bisa mengelola satu gudang.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'start_date.date' => 'Tanggal mulai harus berupa tanggal yang valid.',
        ];
    }
}

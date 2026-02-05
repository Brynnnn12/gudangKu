<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Pastikan logic Policy 'update' sudah mengecek apakah user login
        // punya hak untuk mengedit user tersebut.
        return $this->user()->can('update', $this->route('employee'));
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => strip_tags(trim($this->name)),
            'email' => strtolower(trim($this->email)),
        ]);
    }

    public function rules(): array
    {
        // Mengambil model employee dari route
        $employee = $this->route('employee');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'email' => [
                'sometimes',
                'required',
                'string',
                'email:dns',
                'max:255',
                Rule::unique('users')->ignore($employee->id)->whereNull('deleted_at'),
            ],
            'phone_number' => ['sometimes', 'required', 'string', 'regex:/^628[0-9]{9,11}$/'],
            'role' => [
                'sometimes',
                'required',
                'string',
                Rule::in(['admin', 'viewer']),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.regex' => 'Nama hanya boleh berisi huruf.',
            'email.unique' => 'Email ini sudah terdaftar.',
            'email.email' => 'Format email tidak valid.',
            'phone_number.regex' => 'Nomor HP harus format Indonesia (628...) dan panjang 12-14 digit.',

        ];
    }
}

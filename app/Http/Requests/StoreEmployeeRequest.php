<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Pastikan logic Policy sudah terdaftar di AuthServiceProvider
        return $this->user()->can('create', \App\Models\User::class);
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => strip_tags(trim($this->name)),
            // Email dipaksa huruf kecil semua untuk konsistensi data
            'email' => strtolower(trim($this->email)),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z\s]+$/'],
            'email' => [
                'required',
                'string',
                'email:dns',
                'max:255',
                Rule::unique('users', 'email')->whereNull('deleted_at'),
            ],
            'phone_number' => ['required', 'string', 'regex:/^628[0-9]{9,11}$/'],
            'password' => [
                'required',
                'confirmed',
                // Menggunakan standar keamanan password Laravel yang lebih kuat
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(), // Cek apakah password pernah bocor di internet
            ],
            'role' => ['required', 'string', 'in:admin,viewer'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'Nama hanya boleh berisi huruf.',
            'email.unique' => 'Email ini sudah terdaftar.',
            'email.email' => 'Format email tidak valid.',
            'phone_number.regex' => 'Nomor HP harus format Indonesia (628...) dan panjang 12-14 digit.',
            'password.uncompromised' => 'Password yang Anda masukkan terlalu pasaran dan berisiko. Gunakan yang lain!',
        ];
    }
}

<?php

namespace App\Http\Requests\Categories;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Sanitasi input sebelum validasi running
     */
    protected function prepareForValidation()
    {
        if ($this->has('name')) {
            $this->merge([
                // Bersihkan dari tag HTML dan spasi berlebih
                'name' => strip_tags(trim($this->name)),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('categories', 'name')
                    ->ignore($this->route('category')->id)
                    ->whereNull('deleted_at'),
                'regex:/^[a-zA-Z0-9\s\-]+$/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.string' => 'Nama kategori harus berupa teks.',
            'name.max' => 'Nama kategori tidak boleh lebih dari 50 karakter.',
            'name.unique' => 'Nama kategori sudah digunakan.',
            'name.regex' => 'Nama kategori hanya boleh mengandung huruf, angka, spasi, dan tanda hubung (-).',
        ];
    }
}

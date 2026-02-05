import { Form, Head } from '@inertiajs/react';
import AuthImageSection from '@/components/auth-image-section';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';

export default function Register() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Head title="Daftar" />

            <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
                <div className="md:max-w-md w-full px-4 py-4">
                    <div className="mb-12">
                        <h1 className="text-slate-900 text-3xl font-bold">Daftar</h1>
                    </div>

                    <Form
                        action="/register"
                        method="post"
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                    >
                        {({ processing, errors }) => (
                            <>
                                <div>
                                    <Label htmlFor="name" className="text-slate-900 text-[13px] font-medium block mb-2">
                                        Nama lengkap
                                    </Label>
                                    <div className="relative flex items-center">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            placeholder="Masukkan nama lengkap"
                                            className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4.5 h-4.5 absolute right-2" viewBox="0 0 24 24">
                                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H19V9Z" />
                                        </svg>
                                    </div>
                                    <InputError message={errors.name} />
                                </div>

                                <div className="mt-8">
                                    <Label htmlFor="email" className="text-slate-900 text-[13px] font-medium block mb-2">
                                        Alamat email
                                    </Label>
                                    <div className="relative flex items-center">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            placeholder="Masukkan email"
                                            className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4.5 h-4.5 absolute right-2" viewBox="0 0 682.667 682.667">
                                            <defs>
                                                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                                </clipPath>
                                            </defs>
                                            <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                                <path fill="none" strokeMiterlimit="10" strokeWidth="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                                                <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                                            </g>
                                        </svg>
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="mt-8">
                                    <Label htmlFor="password" className="text-slate-900 text-[13px] font-medium block mb-2">
                                        Kata sandi
                                    </Label>
                                    <div className="relative flex items-center">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            placeholder="Masukkan kata sandi"
                                            className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4.5 h-4.5 absolute right-2 cursor-pointer" viewBox="0 0 128 128">
                                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="mt-8">
                                    <Label htmlFor="password_confirmation" className="text-slate-900 text-[13px] font-medium block mb-2">
                                        Konfirmasi kata sandi
                                    </Label>
                                    <div className="relative flex items-center">
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            placeholder="Konfirmasi kata sandi"
                                            className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4.5 h-4.5 absolute right-2 cursor-pointer" viewBox="0 0 128 128">
                                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="mt-12">
                                    <Button
                                        type="submit"
                                        className="w-full shadow-xl py-2.5 px-4 text-sm font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                        tabIndex={5}
                                        disabled={processing}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner className="mr-2" />}
                                        Daftar
                                    </Button>
                                </div>

                                <div className="my-6 flex items-center gap-4">
                                    <hr className="w-full border-slate-300" />
                                    <p className="text-sm text-slate-900 text-center">atau</p>
                                    <hr className="w-full border-slate-300" />
                                </div>

                                <div className="text-center text-sm text-slate-900">
                                    Sudah punya akun?{' '}
                                    <TextLink
                                        href={login()}
                                        className="text-blue-600 font-medium hover:underline"
                                        tabIndex={6}
                                    >
                                        Masuk
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <AuthImageSection alt="register-image" />
            </div>
        </div>
    );
}

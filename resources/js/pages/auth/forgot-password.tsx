// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import AuthImageSection from '@/components/auth-image-section';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Head title="Lupa kata sandi" />

            <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
                <div className="md:max-w-md w-full px-4 py-4">
                    <div className="mb-12">
                        <h1 className="text-slate-900 text-3xl font-bold">Lupa kata sandi</h1>
                    </div>

                    {status && (
                        <div className="text-center text-sm font-medium text-green-600 mt-4">
                            {status}
                        </div>
                    )}

                    <Form {...email.form()}>
                        {({ processing, errors }) => (
                            <>
                                <div>
                                    <Label htmlFor="email" className="text-slate-900 text-[13px] font-medium block mb-2">
                                        Alamat email
                                    </Label>
                                    <div className="relative flex items-center">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="off"
                                            autoFocus
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

                                <div className="mt-12">
                                    <Button
                                        type="submit"
                                        className="w-full shadow-xl py-2.5 px-4 text-sm font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                        disabled={processing}
                                        data-test="email-password-reset-link-button"
                                    >
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Kirim tautan reset kata sandi
                                    </Button>
                                </div>

                                <div className="my-6 flex items-center gap-4">
                                    <hr className="w-full border-slate-300" />
                                    <p className="text-sm text-slate-900 text-center">atau</p>
                                    <hr className="w-full border-slate-300" />
                                </div>

                                <div className="text-center text-sm text-slate-900">
                                    Kembali ke{' '}
                                    <TextLink
                                        href={login()}
                                        className="text-blue-600 font-medium hover:underline"
                                    >
                                        masuk
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <AuthImageSection alt="forgot-password-image" />
            </div>
        </div>
    );
}

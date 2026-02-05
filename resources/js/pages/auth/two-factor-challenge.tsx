import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import AuthImageSection from '@/components/auth-image-section';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Kode Pemulihan',
                description:
                    'Silakan konfirmasi akses ke akun Anda dengan memasukkan salah satu kode pemulihan darurat Anda.',
                toggleText: 'masuk menggunakan kode autentikasi',
            };
        }

        return {
            title: 'Kode Autentikasi',
            description:
                'Masukkan kode autentikasi yang disediakan oleh aplikasi autentikator Anda.',
            toggleText: 'masuk menggunakan kode pemulihan',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Head title="Autentikasi Dua Faktor" />

            <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
                <div className="md:max-w-md w-full px-4 py-4">
                    <div className="mb-12">
                        <h1 className="text-slate-900 text-3xl font-bold">{authConfigContent.title}</h1>
                        <p className="text-slate-600 text-sm mt-2">{authConfigContent.description}</p>
                    </div>

                    <div className="space-y-6">
                        <Form
                            {...store.form()}
                            className="space-y-4"
                            resetOnError
                            resetOnSuccess={!showRecoveryInput}
                        >
                            {({ errors, processing, clearErrors }) => (
                                <>
                                    {showRecoveryInput ? (
                                        <>
                                            <div>
                                                <label htmlFor="recovery_code" className="text-slate-900 text-[13px] font-medium block mb-2">
                                                    Kode pemulihan
                                                </label>
                                                <div className="relative flex items-center">
                                                    <input
                                                        id="recovery_code"
                                                        name="recovery_code"
                                                        type="text"
                                                        placeholder="Masukkan kode pemulihan"
                                                        autoFocus={showRecoveryInput}
                                                        required
                                                        className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                                                    />
                                                </div>
                                                <InputError message={errors.recovery_code} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center space-y-3 text-center">
                                            <div className="flex w-full items-center justify-center">
                                                <InputOTP
                                                    name="code"
                                                    maxLength={OTP_MAX_LENGTH}
                                                    value={code}
                                                    onChange={(value) => setCode(value)}
                                                    disabled={processing}
                                                    pattern={REGEXP_ONLY_DIGITS}
                                                >
                                                    <InputOTPGroup>
                                                        {Array.from(
                                                            { length: OTP_MAX_LENGTH },
                                                            (_, index) => (
                                                                <InputOTPSlot
                                                                    key={index}
                                                                    index={index}
                                                                />
                                                            ),
                                                        )}
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                            <InputError message={errors.code} />
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full shadow-xl py-2.5 px-4 text-sm font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                        disabled={processing}
                                    >
                                        Lanjutkan
                                    </Button>

                                    <div className="text-center text-sm text-slate-900">
                                        <span>atau Anda dapat </span>
                                        <button
                                            type="button"
                                            className="cursor-pointer text-blue-600 font-medium hover:underline"
                                            onClick={() =>
                                                toggleRecoveryMode(clearErrors)
                                            }
                                        >
                                            {authConfigContent.toggleText}
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>

                <AuthImageSection alt="two-factor-image" />
            </div>
        </div>
    );
}

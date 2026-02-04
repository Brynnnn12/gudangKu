// Components
import { Form, Head } from '@inertiajs/react';
import AuthImageSection from '@/components/auth-image-section';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Head title="Verifikasi email" />

            <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
                <div className="md:max-w-md w-full px-4 py-4">
                    <div className="mb-12">
                        <h1 className="text-slate-900 text-3xl font-bold">Verifikasi email</h1>
                        <p className="text-slate-600 text-sm mt-2">Silakan verifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan kepada Anda.</p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="text-center text-sm font-medium text-green-600 mt-4">
                            Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                        </div>
                    )}

                    <Form {...send.form()} className="space-y-6 text-center">
                        {({ processing }) => (
                            <>
                                <Button disabled={processing} variant="secondary" className="w-full shadow-xl py-2.5 px-4 text-sm font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                    {processing && <Spinner className="mr-2" />}
                                    Kirim ulang email verifikasi
                                </Button>

                                <TextLink
                                    href={logout()}
                                    className="mx-auto block text-sm text-slate-900 hover:underline"
                                >
                                    Keluar
                                </TextLink>
                            </>
                        )}
                    </Form>
                </div>

                <AuthImageSection alt="verify-email-image" />
            </div>
        </div>
    );
}

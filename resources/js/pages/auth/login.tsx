import { Form, Head } from '@inertiajs/react';
import { Package2, Truck } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            <Head title="Log in" />

            <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white">
                <div className="mx-auto grid w-full max-w-[400px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Welcome Back
                        </h1>
                        <p className="text-balance text-gray-500">
                            Enter your credentials to access the warehouse
                            system
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <Button
                            variant="outline"
                            className="w-full gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                            asChild
                        >
                            <a href="/auth/google/redirect">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Continue with Google
                            </a>
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500 font-medium">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="grid gap-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-slate-700">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                            className="border-slate-200 focus-visible:ring-blue-500"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password" className="text-slate-700">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="ml-auto text-sm text-slate-500 hover:text-blue-600 font-medium"
                                                    tabIndex={5}
                                                >
                                                    Forgot your password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            className="border-slate-200 focus-visible:ring-blue-500"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="text-sm font-normal text-slate-600"
                                        >
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && (
                                            <Spinner className="mr-2" />
                                        )}
                                        Log in
                                    </Button>

                                    {status && (
                                        <div className="text-center text-sm font-medium text-green-600">
                                            {status}
                                        </div>
                                    )}
                                </>
                            )}
                        </Form>
                    </div>

                    {canRegister && (
                        <div className="mt-4 text-center text-sm text-slate-600">
                            Don&apos;t have an account?{' '}
                            <TextLink
                                href={register()}
                                tabIndex={5}
                                className="font-semibold underline text-blue-600 hover:text-blue-800"
                            >
                                Sign up
                            </TextLink>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-slate-50 relative hidden flex-col items-center justify-center overflow-hidden p-8 lg:flex border-l border-slate-100">
                <div className="bg-grid-slate-200/[0.5] absolute inset-0 bg-[size:60px_60px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent" />

                <div className="relative z-10 flex max-w-md flex-col items-center gap-6 text-center">
                    <div className="rounded-2xl bg-white p-4 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 backdrop-blur-sm">
                        <Package2 className="h-20 w-20 text-blue-600" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                            GudangKu
                        </h2>
                        <p className="text-lg text-slate-500">
                            Next-gen warehouse management system for modern
                            logistics.
                        </p>
                    </div>

                    <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-4">
                        <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md">
                            <Truck className="mb-2 h-6 w-6 text-blue-500" />
                            <div className="text-sm font-semibold text-slate-700">
                                Fast Delivery
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md">
                            <Package2 className="mb-2 h-6 w-6 text-emerald-500" />
                            <div className="text-sm font-semibold text-slate-700">
                                Smart Tracking
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

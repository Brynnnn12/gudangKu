import { Link } from '@inertiajs/react';
import { Package2, Truck } from 'lucide-react';
import type { AuthLayoutProps } from '@/types';

export default function WarehouseLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white">
                <div className="mx-auto grid w-full max-w-100 gap-6">
                    <div className="grid gap-2 text-center">
                        <Link href="/" className="mx-auto mb-4 flex items-center gap-2 font-bold text-xl text-blue-600 md:hidden">
                            <Package2 className="h-6 w-6" />
                            GudangKu
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            {title}
                        </h1>
                        <p className="text-balance text-gray-500">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>

            <div className="bg-slate-50 relative hidden flex-col items-center justify-center overflow-hidden p-8 lg:flex border-l border-slate-100">
                <div className="absolute inset-0 bg-grid-slate-200/[0.5] bg-size-[60px_60px]" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-50 to-transparent" />

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

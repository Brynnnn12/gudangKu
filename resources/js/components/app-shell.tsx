import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { FlashToaster } from '@/components/flash-toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { SharedData } from '@/types';

type Props = {
    children: ReactNode;
    variant?: 'header' | 'sidebar';
};

export function AppShell({ children, variant = 'header' }: Props) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;



    if (variant === 'header') {
        return (
            <>
                <Toaster
                    position="bottom-right"
                    richColors={false}
                    closeButton
                    expand={true}
                    visibleToasts={9}
                />
                <div className="flex min-h-screen w-full flex-col">
                    {children}
                    <FlashToaster />
                </div>
            </>
        );
    }


    return (
        <>
            <Toaster
                position="bottom-right"
                richColors={false}
                closeButton
                expand={true}
                visibleToasts={9}
            />
            <SidebarProvider defaultOpen={isOpen}>
                {children}
                <FlashToaster />
            </SidebarProvider>
        </>
    );
}

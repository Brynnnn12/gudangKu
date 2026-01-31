import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { SharedData } from '@/types';

export function FlashToaster() {
    const page = usePage<SharedData>();
    const flash = page.props.flash;
    const shownRef = useRef<string | null>(null);

    useEffect(() => {
        if (!flash) {
            return;
        }

        // Prevent showing the same toast twice
        const currentFlashKey = JSON.stringify(flash);
        if (shownRef.current === currentFlashKey) {
            return;
        }
        shownRef.current = currentFlashKey;

        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.warning) {
            toast.warning(flash.warning);
        }
        if (flash.message) {
            toast.message(flash.message);
        }
        if (flash.status) {
            toast.info(flash.status);
        }
    }, [flash]);

    return null;
}

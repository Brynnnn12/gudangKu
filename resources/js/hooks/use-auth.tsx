import { usePage } from '@inertiajs/react';
import type{ SharedData } from '@/types';

export function useAuth() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Helper untuk cek role
    const hasRole = (roleName: string) => user?.roles?.some((role) => role.name === roleName) ?? false;

    // Helper untuk cek permission
    const can = (permissionName: string) => user?.permissions?.includes(permissionName) ?? false;

    return {
        user,
        hasRole,
        can,
        // Shortcut untuk PT RBM
        isSuperAdmin: hasRole('super-admin'),
        isAdmin: hasRole('admin'),
    };
}

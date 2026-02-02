import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    Folder,
    Warehouse,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useAuth } from '@/hooks/use-auth';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { isSuperAdmin } = useAuth();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard.url(),
            icon: LayoutGrid,
        },

        ...(isSuperAdmin ? [
            {
                title: 'Manajemen Pengguna',
                href: '#',
                icon: Users,
                items: [
                    {
                        title: 'Karyawan',
                        href: '/dashboard/employees',
                    },
                ],
            },
            {
                title: 'Master Data',
                href: '#',
                icon: Folder,
                items: [
                    {
                        title: 'Kategori',
                        href: '/dashboard/categories',
                    },
                    {
                        title: 'Produk',
                        href: '/dashboard/products',
                    },
                    {
                        title: 'Harga Produk',
                        href: '/dashboard/product-prices',
                    },
                ],
            },
            {
                title: 'Gudang & Stok',
                href: '#',
                icon: Warehouse,
                items: [
                    {
                        title: 'Gudang',
                        href: '/dashboard/warehouses',
                    },
                    {
                        title: 'Pengguna Gudang',
                        href: '/dashboard/warehouse-users',
                    },
                    {
                        title: 'Stok Gudang',
                        href: '/dashboard/warehouse-stocks',
                    },
                    {
                        title: 'Log Stok',
                        href: '/dashboard/stock-logs',
                    },
                    {
                        title: 'Batch Stok',
                        href: '/dashboard/stock-batches',
                    }
                ],
            },
        ] : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard.url()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

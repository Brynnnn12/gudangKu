import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Package,

    Boxes,
    Settings2
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

    // 1. Menu Utama (Tanpa Dropdown)
    const topNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard.url(),
            icon: LayoutGrid,
        },
    ];

    // 2. Kelompok Operasional (Dropdown)
    const inventoryNavItems: NavItem[] = [
        {
            title: 'Manajemen Stok',
            href: '#',
            icon: Boxes,
            items: [
                { title: 'Stok Gudang', href: '/dashboard/warehouse-stocks' },
                { title: 'Batch Stok (FEFO)', href: '/dashboard/stock-batches' },
                { title: 'Transfer Barang', href: '/dashboard/stock-transfers' },
                { title: 'Riwayat Mutasi', href: '/dashboard/stock-logs' },
            ],
        },
    ];

    // 3. Kelompok Admin (Dropdown - Super Admin Only)
    const adminNavItems: NavItem[] = isSuperAdmin ? [
        {
            title: 'Katalog Produk',
            href: '#',
            icon: Package,
            items: [
                { title: 'Daftar Produk', href: '/dashboard/products' },
                { title: 'Kategori Produk', href: '/dashboard/categories' },
                { title: 'Riwayat Harga', href: '/dashboard/product-prices' },
            ],
        },
        {
            title: 'Konfigurasi Sistem',
            href: '#',
            icon: Settings2,
            items: [
                { title: 'Daftar Gudang', href: '/dashboard/warehouses' },
                { title: 'Data Karyawan', href: '/dashboard/employees' },
                { title: 'Penugasan Staf', href: '/dashboard/warehouse-users' },
            ],
        },
    ] : [];

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

            <SidebarContent className="gap-0">
                {/* Bagian Dashboard */}
                <NavMain items={topNavItems} />

                {/* Bagian Operasional (Dropdown) */}
                <NavMain title="Operasional" items={inventoryNavItems} />

                {/* Bagian Master Data (Dropdown - Admin Only) */}
                {isSuperAdmin && (
                    <NavMain title="Administrator" items={adminNavItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

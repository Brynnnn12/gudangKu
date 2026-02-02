import { Link } from '@inertiajs/react';
import { Folder, LayoutGrid, User2Icon } from 'lucide-react';
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
            title: 'Dashboard Analytics',
            href: dashboard.url(),
            icon: LayoutGrid,
        },
        ...(isSuperAdmin ? [{
            title: 'Employees',
            href: '/dashboard/employees',
            icon: User2Icon,
        }] : []),
        ...(isSuperAdmin ? [{
            title: 'Master Data',
            href: '#',
            icon: Folder,
            items: [
                 {
                     title: 'Categories',
                     href: '/dashboard/categories',
                 },
                 {
                     title: 'Products',
                     href: '/dashboard/products',
                 },
                 {
                        title: 'Warehouses',
                        href: '/dashboard/warehouses',
                 },
                 {
                        title: 'Warehouse Users',
                        href: '/dashboard/warehouse-users',
                 }
             ],
        }] : []),
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

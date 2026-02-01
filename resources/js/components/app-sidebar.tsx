import { Link, usePage } from '@inertiajs/react';
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
import { dashboard } from '@/routes';
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isSuperAdmin = auth.user.roles?.some((role) => role.name === 'super-admin');

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
                     href: '#',
                 },
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

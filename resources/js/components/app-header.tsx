import { Link, usePage } from '@inertiajs/react';
import { Boxes, LayoutGrid, Menu, Package, Search, Settings2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useAuth } from '@/hooks/use-auth';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const { isSuperAdmin } = useAuth();
    const getInitials = useInitials();
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();

    const topNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard.url(),
            icon: LayoutGrid,
        },
    ];

    const inventoryNavItems: NavItem[] = [
        {
            title: 'Manajemen Stok',
            href: '#',
            icon: Boxes,
            items: [
                { title: 'Stok Gudang', href: '/dashboard/warehouse-stocks' },
                { title: 'Transfer Barang', href: '/dashboard/stock-transfers' },
                { title: 'Riwayat Mutasi', href: '/dashboard/stock-logs' },
            ],
        },
    ];

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

    const mainNavItems = [
        ...topNavItems,
        ...inventoryNavItems,
        ...adminNavItems,
    ];
    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 h-8.5 w-8.5"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation Menu
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <div key={item.title} className="flex flex-col space-y-2">
                                                    {item.items ? (
                                                        <>
                                                            <div className="flex items-center space-x-2 font-medium">
                                                                {item.icon && (
                                                                    <item.icon className="h-5 w-5" />
                                                                )}
                                                                <span>{item.title}</span>
                                                            </div>
                                                            <div className="ml-7 flex flex-col space-y-3 border-l pl-3">
                                                                {item.items.map((subItem) => (
                                                                    <Link
                                                                        key={subItem.title}
                                                                        href={subItem.href}
                                                                        className="font-medium text-muted-foreground hover:text-foreground"
                                                                    >
                                                                        {subItem.title}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Link
                                                            href={item.href}
                                                            className="flex items-center space-x-2 font-medium"
                                                        >
                                                            {item.icon && (
                                                                <item.icon className="h-5 w-5" />
                                                            )}
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col space-y-4 border-t pt-4">
                                            <div className="text-xs font-semibold uppercase text-muted-foreground">
                                                Help & Support
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={dashboard.url()}
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem
                                        key={index}
                                        className="relative flex h-full items-center"
                                    >
                                        {item.items ? (
                                            <>
                                                <NavigationMenuTrigger className="h-9 px-3">
                                                    {item.icon && (
                                                        <item.icon className="mr-2 h-4 w-4" />
                                                    )}
                                                    {item.title}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className="grid w-100-3 p-4 md:w-125 md:grid-cols-2 lg:w-150 bg-popover text-popover-foreground">
                                                        {item.items.map((subItem) => (
                                                            <li key={subItem.title}>
                                                                <NavigationMenuLink asChild>
                                                                    <Link
                                                                        href={subItem.href}
                                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                                    >
                                                                        <div className="text-sm font-medium leading-none">
                                                                            {subItem.title}
                                                                        </div>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    whenCurrentUrl(
                                                        item.href,
                                                        activeItemStyles,
                                                    ),
                                                    'h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                {item.icon && (
                                                    <item.icon className="mr-2 h-4 w-4" />
                                                )}
                                                {item.title}
                                            </Link>
                                        )}
                                        {!item.items && isCurrentUrl(item.href) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="group h-9 w-9 cursor-pointer"
                        >
                            <Search className="size-5! opacity-80 group-hover:opacity-100" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}

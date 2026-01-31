import { Link } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: Link[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

export function Pagination({ links, meta }: PaginationProps) {
    if (meta.last_page <= 1) return null;

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
                Showing {meta.from} to {meta.to} of {meta.total} results
            </div>
            <div className="flex items-center space-x-2">
                {/* First Page */}
                <Button
                    variant="outline"
                    size="icon"
                    disabled={meta.current_page === 1}
                    asChild={meta.current_page !== 1}
                >
                    {meta.current_page !== 1 ? (
                        <Link href={links[0]?.url || '#'} preserveScroll>
                            <ChevronsLeft className="h-4 w-4" />
                        </Link>
                    ) : (
                        <ChevronsLeft className="h-4 w-4" />
                    )}
                </Button>

                {/* Previous Page */}
                <Button
                    variant="outline"
                    size="icon"
                    disabled={meta.current_page === 1}
                    asChild={meta.current_page !== 1}
                >
                    {meta.current_page !== 1 ? (
                        <Link href={links.find(l => l.label === '&laquo; Previous')?.url || '#'} preserveScroll>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center space-x-1">
                    {links.slice(1, -1).map((link, index) => {
                        const pageNum = parseInt(link.label);
                        const currentPage = meta.current_page;

                        // Show first page, last page, current page, and pages around current
                        if (
                            pageNum === 1 ||
                            pageNum === meta.last_page ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                            return (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={link.active}
                                    asChild={!link.active && link.url !== null}
                                >
                                    {!link.active && link.url ? (
                                        <Link href={link.url} preserveScroll>
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <span>{link.label}</span>
                                    )}
                                </Button>
                            );
                        } else if (
                            pageNum === currentPage - 2 ||
                            pageNum === currentPage + 2
                        ) {
                            return <span key={index} className="px-1">...</span>;
                        }
                        return null;
                    })}
                </div>

                {/* Next Page */}
                <Button
                    variant="outline"
                    size="icon"
                    disabled={meta.current_page === meta.last_page}
                    asChild={meta.current_page !== meta.last_page}
                >
                    {meta.current_page !== meta.last_page ? (
                        <Link href={links.find(l => l.label === 'Next &raquo;')?.url || '#'} preserveScroll>
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>

                {/* Last Page */}
                <Button
                    variant="outline"
                    size="icon"
                    disabled={meta.current_page === meta.last_page}
                    asChild={meta.current_page !== meta.last_page}
                >
                    {meta.current_page !== meta.last_page ? (
                        <Link href={links[links.length - 1]?.url || '#'} preserveScroll>
                            <ChevronsRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <ChevronsRight className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}

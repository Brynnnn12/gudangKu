import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from '@/components/pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import CreateCategoryModal from '@/pages/categories/create';
import EditCategoryModal from '@/pages/categories/edit';
import { type BreadcrumbItem } from '@/types';
import type { Category, Filters, PageProps } from '@/types/models/categories';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/dashboard/categories' },
];

export default function Index({
    categories,
    filters = {},
}: {
    categories: PageProps;
    filters?: Filters;
}) {
    const searchForm = useForm({
        search: filters.search || '',
    });

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        category: Category | null;
    }>({
        isOpen: false,
        category: null,
    });

    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState<{
        isOpen: boolean;
        category: Category | null;
    }>({
        isOpen: false,
        category: null,
    });

    // Clean query params - remove empty values
    const queryParams = useMemo(() => {
        const params: Record<string, string> = {};
        if (searchForm.data.search) params.search = searchForm.data.search;
        return params;
    }, [searchForm.data.search]);

    // Debounced search with clean URL
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                '/dashboard/categories',
                queryParams,
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [queryParams]);

    const openEditModal = (category: Category) => {
        setEditModal({ isOpen: true, category });
    };

    const closeEditModal = () => {
        setEditModal({ isOpen: false, category: null });
    };

    const openDeleteModal = (category: Category) => {
        setDeleteModal({ isOpen: true, category });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, category: null });
    };

    const confirmDelete = () => {
        if (!deleteModal.category) return;

        router.delete(`/dashboard/categories/${deleteModal.category.id}`, {
            preserveScroll: true,
            onSuccess: () => closeDeleteModal(),
        });
    };

    const clearFilters = () => {
        searchForm.setData({ search: '' });
    };

    const hasActiveFilters = searchForm.data.search;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Categories</h1>
                    <Button onClick={() => setCreateModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>

                {/* Search */}
                <div className="mb-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or slug..."
                            value={searchForm.data.search}
                            onChange={(e) => searchForm.setData('search', e.target.value)}
                            className="pl-9"
                            disabled={searchForm.processing}
                        />
                    </div>
                    <div className="flex gap-2">
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={clearFilters}
                                disabled={searchForm.processing}
                                title="Clear filters"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.data.length > 0 ? (
                                categories.data.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditModal(category)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => openDeleteModal(category)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <Pagination
                        links={categories.links}
                        meta={{
                            current_page: categories.current_page,
                            last_page: categories.last_page,
                            per_page: categories.per_page,
                            total: categories.total,
                            from: categories.from,
                            to: categories.to,
                        }}
                    />
                </div>

                {/* Delete Confirmation Modal */}
                <AlertDialog open={deleteModal.isOpen} onOpenChange={closeDeleteModal}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-foreground">
                                    {deleteModal.category?.name}
                                </span>
                                ? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Modals */}
                <CreateCategoryModal
                    open={createModal}
                    onClose={() => setCreateModal(false)}
                />
                <EditCategoryModal
                    open={editModal.isOpen}
                    category={editModal.category}
                    onClose={closeEditModal}
                />
            </div>
        </AppLayout>
    );
}

import { Head, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Pagination } from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Category, Filters, PageProps } from '@/types/models/categories';
import { useCategoryModals } from '@/hooks/useCategoryModals';
import { useSelection } from '@/hooks/useSelection';
import { CategoryToolbar } from './components/CategoryToolbar';
import { CategoryTable } from './components/CategoryTable';
import { CategoryModals } from './components/CategoryModals';

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

    const { modals, openModal, closeModal } = useCategoryModals();
    const {
        selectedIds,
        toggleSelectAll,
        toggleSelectOne,
        clearSelection,
        allSelected,
        someSelected,
        selectedCount,
    } = useSelection(categories.data);

    // Search with auto page reset
    useEffect(() => {
        if (!searchForm.isDirty) return;

        const timer = setTimeout(() => {
            router.get(
                '/dashboard/categories',
                {
                    search: searchForm.data.search,
                    page: undefined, // Reset to page 1 on search
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['categories'],
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchForm.data.search]);

    // Delete handlers
    const handleDelete = () => {
        if (!modals.delete.category) return;

        router.delete(`/dashboard/categories/${modals.delete.category.id}`, {
            preserveScroll: true,
            onSuccess: () => closeModal('delete'),
        });
    };

    const handleBulkDelete = () => {
        router.delete('/dashboard/categories/bulk-destroy', {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                clearSelection();
                closeModal('bulkDelete');
            },
        });
    };

    // Filter handlers
    const clearFilters = () => {
        searchForm.setData({ search: '' });
        router.get('/dashboard/categories', {}, {
            replace: true,
            preserveState: false
        });
    };

    // Computed values
    const hasActiveFilters = !!searchForm.data.search;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="p-6">
                <CategoryToolbar
                    searchValue={searchForm.data.search}
                    onSearchChange={(value) => searchForm.setData('search', value)}
                    onAddClick={() => openModal('create')}
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={clearFilters}
                    selectedCount={selectedCount}
                    isSearching={searchForm.processing}
                    hasActiveFilters={hasActiveFilters}
                />

                <CategoryTable
                    categories={categories.data}
                    selectedIds={selectedIds}
                    onSelectAll={toggleSelectAll}
                    onSelectOne={toggleSelectOne}
                    onEdit={(category) => openModal('edit', category)}
                    onDelete={(category) => openModal('delete', category)}
                    allSelected={allSelected}
                    someSelected={someSelected}
                />

                {/* Pagination */}
                {categories.data.length > 0 && (
                    <div className="mt-4">
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
                )}

                <CategoryModals
                    modals={modals}
                    onCloseModal={closeModal}
                    onConfirmDelete={handleDelete}
                    onConfirmBulkDelete={handleBulkDelete}
                    selectedCount={selectedCount}
                />
            </div>
        </AppLayout>
    );
}

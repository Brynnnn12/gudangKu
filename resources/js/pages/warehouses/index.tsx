import { Head, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Pagination } from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Warehouse, Filters, PageProps } from '@/types/models/warehouses';
import { useWarehouseModals } from '@/hooks/useWarehouseModals';
import { useSelection } from '@/hooks/useSelection';
import { WarehouseToolbar } from './components/WarehouseToolbar';
import { WarehouseTable } from './components/WarehouseTable';
import { WarehouseModals } from './components/WarehouseModals';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Warehouses', href: '/dashboard/warehouses' },
];

export default function Index({
    warehouses,
    filters = {},
}: {
    warehouses: PageProps;
    filters?: Filters;
}) {
    const searchForm = useForm({
        search: filters.search || '',
    });

    const { modals, openModal, closeModal } = useWarehouseModals();
    const {
        selectedIds,
        toggleSelectAll,
        toggleSelectOne,
        clearSelection,
        allSelected,
        someSelected,
        selectedCount,
    } = useSelection(warehouses.data);

    // Search with auto page reset
    useEffect(() => {
        if (!searchForm.isDirty) return;

        const timer = setTimeout(() => {
            router.get(
                '/dashboard/warehouses',
                {
                    search: searchForm.data.search,
                    page: undefined, // Reset to page 1 on search
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['warehouses'],
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchForm.data.search]);

    const handleDelete = () => {
        if (!modals.delete.warehouse) return;

        router.delete(`/dashboard/warehouses/${modals.delete.warehouse.id}`, {
            preserveScroll: true,
            onSuccess: () => closeModal('delete'),
        });
    };

    const handleBulkDelete = () => {
        router.delete('/dashboard/warehouses/bulk-destroy', {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                clearSelection();
                closeModal('bulkDelete');
            },
        });
    };

    const clearFilters = () => {
        searchForm.setData({ search: '' });
        router.get('/dashboard/warehouses', {}, {
            replace: true,
            preserveState: false
        });
    };

    const hasActiveFilters = !!searchForm.data.search;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Warehouses" />
            <div className="p-6">
                <WarehouseToolbar
                    searchValue={searchForm.data.search}
                    onSearchChange={(value) => searchForm.setData('search', value)}
                    onAddClick={() => openModal('create')}
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={clearFilters}
                    selectedCount={selectedCount}
                    isSearching={searchForm.processing}
                    hasActiveFilters={hasActiveFilters}
                />

                <WarehouseTable
                    warehouses={warehouses.data}
                    selectedIds={selectedIds}
                    onSelectAll={toggleSelectAll}
                    onSelectOne={toggleSelectOne}
                    onEdit={(warehouse) => openModal('edit', warehouse)}
                    onDelete={(warehouse) => openModal('delete', warehouse)}
                    allSelected={allSelected}
                    someSelected={someSelected}
                />

                {/* Pagination */}
                {warehouses.data.length > 0 && (
                    <div className="mt-4">
                        <Pagination
                            links={warehouses.links}
                            meta={{
                                current_page: warehouses.current_page,
                                last_page: warehouses.last_page,
                                per_page: warehouses.per_page,
                                total: warehouses.total,
                                from: warehouses.from,
                                to: warehouses.to,
                            }}
                        />
                    </div>
                )}

                <WarehouseModals
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

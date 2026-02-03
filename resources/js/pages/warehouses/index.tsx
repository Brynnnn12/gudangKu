import { Head, router } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { useSearch } from '@/hooks/useSearch';
import { useSelection } from '@/hooks/useSelection';
import { useWarehouseModals } from '@/hooks/useWarehouseModals';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Filters, PageProps } from '@/types/models/warehouses';
import { WarehouseModals } from './components/WarehouseModals';
import { WarehouseTable } from './components/WarehouseTable';
import { WarehouseToolbar } from './components/WarehouseToolbar';

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
    const { searchValue, setSearchValue, clearSearch, isSearching, hasActiveSearch } = useSearch({
        route: '/dashboard/warehouses',
        initialSearch: filters.search || '',
        only: ['warehouses'],
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
        clearSearch();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Warehouses" />
            <div className="p-6">
                <WarehouseToolbar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onAddClick={() => openModal('create')}
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={clearFilters}
                    selectedCount={selectedCount}
                    isSearching={isSearching}
                    hasActiveFilters={hasActiveSearch}
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
                {warehouses.last_page > 1 && (
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

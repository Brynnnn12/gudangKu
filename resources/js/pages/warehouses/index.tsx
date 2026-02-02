import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Pagination } from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Warehouse, Filters, PageProps } from '@/types/models/warehouses';
import { WarehouseToolbar } from './components/WarehouseToolbar';
import { WarehouseTable } from './components/WarehouseTable';
import { WarehouseModals } from './components/WarehouseModals';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Warehouses', href: '/dashboard/warehouses' },
];

interface ModalState {
    create: boolean;
    edit: { isOpen: boolean; warehouse: Warehouse | null };
    delete: { isOpen: boolean; warehouse: Warehouse | null };
    bulkDelete: boolean;
}

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

    const [modals, setModals] = useState<ModalState>({
        create: false,
        edit: { isOpen: false, warehouse: null },
        delete: { isOpen: false, warehouse: null },
        bulkDelete: false,
    });

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

    const openModal = (type: keyof ModalState, data?: Warehouse) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: true }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: true, warehouse: data || null } }));
        }
    };

    const closeModal = (type: keyof ModalState) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: false }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: false, warehouse: null } }));
        }
    };

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
                setSelectedIds([]);
                closeModal('bulkDelete');
            },
        });
    };

    const toggleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? warehouses.data.map(wh => wh.id) : []);
    };

    const toggleSelectOne = (id: number, checked: boolean) => {
        setSelectedIds(prev =>
            checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
        );
    };

    const clearFilters = () => {
        searchForm.setData({ search: '' });
        router.get('/dashboard/warehouses', {}, {
            replace: true,
            preserveState: false
        });
    };

    const hasActiveFilters = !!searchForm.data.search;
    const allSelected = warehouses.data.length > 0 && selectedIds.length === warehouses.data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < warehouses.data.length;

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
                    selectedCount={selectedIds.length}
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
                    selectedCount={selectedIds.length}
                />
            </div>
        </AppLayout>
    );
}

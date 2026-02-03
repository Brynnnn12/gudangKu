import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { Pagination } from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { WarehouseUserModals } from './components/WarehouseUserModals';
import { WarehouseUserTable } from './components/WarehouseUserTable';
import { WarehouseUserToolbar } from './components/WarehouseUserToolbar';
import type { WarehouseUser, Filters, PageProps, Warehouse, User } from '@/types/models/warehouse-users';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Warehouse Users', href: '/dashboard/warehouse-users' },
];

interface ModalState {
    create: boolean;
    edit: { isOpen: boolean; warehouseUser: WarehouseUser | null };
    delete: { isOpen: boolean; warehouseUser: WarehouseUser | null };
    bulkDelete: boolean;
}

export default function Index({
    warehouseUsers,
    warehouses,
    users,
    filters = {},
}: {
    warehouseUsers: PageProps;
    warehouses: Warehouse[];
    users: User[];
    filters?: Filters;
}) {
    const { searchValue, setSearchValue, clearSearch, isSearching, hasActiveSearch } = useSearch({
        route: '/dashboard/warehouse-users',
        initialSearch: filters.search || '',
        only: ['warehouseUsers'],
    });

    const [modals, setModals] = useState<ModalState>({
        create: false,
        edit: { isOpen: false, warehouseUser: null },
        delete: { isOpen: false, warehouseUser: null },
        bulkDelete: false,
    });

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const openModal = (type: keyof ModalState, data?: WarehouseUser) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: true }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: true, warehouseUser: data || null } }));
        }
    };

    const closeModal = (type: keyof ModalState) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: false }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: false, warehouseUser: null } }));
        }
    };

    const handleDelete = () => {
        if (!modals.delete.warehouseUser) return;

        router.delete(`/dashboard/warehouse-users/${modals.delete.warehouseUser.id}`, {
            preserveScroll: true,
            onSuccess: () => closeModal('delete'),
        });
    };

    const handleBulkDelete = () => {
        router.delete('/dashboard/warehouse-users/bulk-destroy', {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                closeModal('bulkDelete');
            },
        });
    };

    const toggleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? warehouseUsers.data.map(wh => wh.id) : []);
    };

    const toggleSelectOne = (id: number, checked: boolean) => {
        setSelectedIds(prev =>
            checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
        );
    };

    const clearFilters = () => {
        clearSearch();
    };

    const allSelected = warehouseUsers.data.length > 0 && selectedIds.length === warehouseUsers.data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < warehouseUsers.data.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Warehouse Users" />
            <div className="p-6">
                <WarehouseUserToolbar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onAddClick={() => openModal('create')}
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={clearFilters}
                    selectedCount={selectedIds.length}
                    isSearching={isSearching}
                    hasActiveFilters={hasActiveSearch}
                />

                <WarehouseUserTable
                    warehouseUsers={warehouseUsers.data}
                    selectedIds={selectedIds}
                    onSelectAll={toggleSelectAll}
                    onSelectOne={toggleSelectOne}
                    onEdit={(warehouseUser) => openModal('edit', warehouseUser)}
                    onDelete={(warehouseUser) => openModal('delete', warehouseUser)}
                    allSelected={allSelected}
                    someSelected={someSelected}
                />

                {/* Pagination */}
                {warehouseUsers.last_page > 1 && (
                    <div className="mt-4">
                        <Pagination
                            links={warehouseUsers.links}
                            meta={{
                                current_page: warehouseUsers.current_page,
                                last_page: warehouseUsers.last_page,
                                per_page: warehouseUsers.per_page,
                                total: warehouseUsers.total,
                                from: warehouseUsers.from,
                                to: warehouseUsers.to,
                            }}
                        />
                    </div>
                )}

                <WarehouseUserModals
                    modals={modals}
                    warehouses={warehouses}
                    users={users}
                    onCloseModal={closeModal}
                    onConfirmDelete={handleDelete}
                    onConfirmBulkDelete={handleBulkDelete}
                    selectedCount={selectedIds.length}
                />
            </div>
        </AppLayout>
    );
}

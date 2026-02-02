import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Pagination } from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { PageProps, User as EmployeeUser } from '@/types/models/employee';
import { EmployeeToolbar } from './components/EmployeeToolbar';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeModals } from './components/EmployeeModals';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Employees', href: '/dashboard/employees' },
];

interface Filters {
    search?: string;
    role?: string;
}

interface ModalState {
    create: boolean;
    edit: { isOpen: boolean; employee: EmployeeUser | null };
    delete: { isOpen: boolean; employee: EmployeeUser | null };
    bulkDelete: boolean;
}

export default function Index({
    employees,
    filters = {},
}: {
    employees: PageProps;
    filters?: Filters;
}) {
    const searchForm = useForm({
        search: filters.search || '',
        role: filters.role || '',
    });

    const [modals, setModals] = useState<ModalState>({
        create: false,
        edit: { isOpen: false, employee: null },
        delete: { isOpen: false, employee: null },
        bulkDelete: false,
    });

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Search and filter with auto page reset
    useEffect(() => {
        if (!searchForm.isDirty) return;

        const timer = setTimeout(() => {
            const params: Record<string, string | undefined> = {
                page: undefined, // Reset to page 1 on search/filter
            };
            if (searchForm.data.search) params.search = searchForm.data.search;
            if (searchForm.data.role && searchForm.data.role !== 'all') params.role = searchForm.data.role;

            router.get(
                '/dashboard/employees',
                params,
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['employees'],
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchForm.data.search, searchForm.data.role]);

    // Modal handlers
    const openModal = (type: keyof ModalState, data?: EmployeeUser) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: true }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: true, employee: data || null } }));
        }
    };

    const closeModal = (type: keyof ModalState) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: false }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: false, employee: null } }));
        }
    };

    // Delete handlers
    const handleDelete = () => {
        if (!modals.delete.employee) return;

        router.delete(`/dashboard/employees/${modals.delete.employee.id}`, {
            preserveScroll: true,
            onSuccess: () => closeModal('delete'),
        });
    };

    const handleBulkDelete = () => {
        router.delete('/dashboard/employees/bulk-destroy', {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                closeModal('bulkDelete');
            },
        });
    };

    // Selection handlers
    const toggleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? employees.data.map(emp => emp.id) : []);
    };

    const toggleSelectOne = (id: number, checked: boolean) => {
        setSelectedIds(prev =>
            checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
        );
    };

    // Filter handlers
    const clearFilters = () => {
        searchForm.setData({ search: '', role: '' });
        router.get('/dashboard/employees', {}, {
            replace: true,
            preserveState: false
        });
    };

    // Computed values
    const hasActiveFilters = !!searchForm.data.search || !!searchForm.data.role;
    const allSelected = employees.data.length > 0 && selectedIds.length === employees.data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < employees.data.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="p-6">
                <EmployeeToolbar
                    searchValue={searchForm.data.search}
                    roleValue={searchForm.data.role}
                    onSearchChange={(value) => searchForm.setData('search', value)}
                    onRoleChange={(value) => searchForm.setData('role', value)}
                    onAddClick={() => openModal('create')}
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={clearFilters}
                    selectedCount={selectedIds.length}
                    isSearching={searchForm.processing}
                    hasActiveFilters={hasActiveFilters}
                />

                <EmployeeTable
                    employees={employees.data}
                    selectedIds={selectedIds}
                    onSelectAll={toggleSelectAll}
                    onSelectOne={toggleSelectOne}
                    onEdit={(employee) => openModal('edit', employee)}
                    onDelete={(employee) => openModal('delete', employee)}
                    allSelected={allSelected}
                    someSelected={someSelected}
                />

                {/* Pagination */}
                {employees.data.length > 0 && (
                    <div className="mt-4">
                        <Pagination
                            links={employees.links}
                            meta={{
                                current_page: employees.current_page,
                                last_page: employees.last_page,
                                per_page: employees.per_page,
                                total: employees.total,
                                from: employees.from,
                                to: employees.to,
                            }}
                        />
                    </div>
                )}

                <EmployeeModals
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

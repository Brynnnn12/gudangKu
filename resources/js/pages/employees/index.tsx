import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Pagination } from '@/components/pagination';
import { useGenericModals, type ModalWithData } from '@/hooks/useGenericModals';
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

    const { modals, openModal, closeModal } = useGenericModals<User>({
        simple: ['create', 'bulkDelete'],
        withData: ['edit', 'delete']
    });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const previousFilters = useRef({ search: filters.search || '', role: filters.role || '' });

    // Search and filter with real-time updates
    useEffect(() => {
        // Only trigger if filters actually changed
        if (previousFilters.current.search === searchForm.data.search &&
            previousFilters.current.role === searchForm.data.role) {
            return;
        }

        previousFilters.current = { search: searchForm.data.search, role: searchForm.data.role };

        const timer = setTimeout(() => {
            // Get current URL params to preserve pagination
            const currentParams = new URLSearchParams(window.location.search);
            const params: Record<string, string> = {};

            // Copy all existing params except page (reset to 1 when filters change)
            currentParams.forEach((value, key) => {
                if (key !== 'page') {
                    params[key] = value;
                }
            });

            // Update filter params
            if (searchForm.data.search) params.search = searchForm.data.search;
            else delete params.search;

            if (searchForm.data.role && searchForm.data.role !== 'all') params.role = searchForm.data.role;
            else delete params.role;

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

    // Delete handlers
    const handleDelete = () => {
        const deleteModal = modals.delete as ModalWithData<User>;
        if (!deleteModal.data) return;

        router.delete(`/dashboard/employees/${deleteModal.data.id}`, {
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
                {employees.last_page > 1 && (
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

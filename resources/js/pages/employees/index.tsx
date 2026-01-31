import { Head, Link, router, useForm } from '@inertiajs/react';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { PageProps, User } from '@/types/models/employee';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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
    const { data, setData, processing } = useForm({
        search: filters.search || '',
        role: filters.role || '',
    });
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        employee: User | null;
    }>({
        isOpen: false,
        employee: null,
    });
    // Clean query params - remove empty values
    const queryParams = useMemo(() => {
        const params: Record<string, string> = {};
        if (data.search) params.search = data.search;
        if (data.role && data.role !== 'all') params.role = data.role;
        return params;
    }, [data.search, data.role]);

    // Debounced search with clean URL
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                '/dashboard/employees',
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

    const openDeleteModal = (employee: User) => {
        setDeleteModal({ isOpen: true, employee });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, employee: null });
    };

    const confirmDelete = () => {
        if (!deleteModal.employee) return;

        router.delete(`/dashboard/employees/${deleteModal.employee.id}`, {
            preserveScroll: true,
            onSuccess: () => closeDeleteModal(),
        });
    };

    const clearFilters = () => {
        setData({ search: '', role: '' });
    };

    const hasActiveFilters = data.search || data.role;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Employees</h1>
                    <Button asChild>
                        <Link href="/dashboard/employees/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Employee
                        </Link>
                    </Button>
                </div>

                {/* Search and Filter */}
                <div className="mb-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            className="pl-9"
                            disabled={processing}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={data.role || undefined}
                            onValueChange={(value) => setData('role', value)}
                            disabled={processing}
                        >
                            <SelectTrigger className="w-45">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={clearFilters}
                                disabled={processing}
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
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.data.length > 0 ? (
                                employees.data.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell className="capitalize">
                                            {employee.roles?.map((r) => r.name).join(', ') ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/dashboard/employees/${employee.id}/edit`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => openDeleteModal(employee)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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

                {/* Delete Confirmation Modal */}
                <AlertDialog open={deleteModal.isOpen} onOpenChange={closeDeleteModal}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-foreground">
                                    {deleteModal.employee?.name}
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
            </div>
        </AppLayout>
    );
}

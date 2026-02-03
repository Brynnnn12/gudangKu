import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type {
    StockTransfer,
    StockTransfersIndexPageProps,
} from '@/types/models/stock-transfers';
import { StockTransferTable } from './components/StockTransferTable';
import { StockTransferToolbar } from './components/StockTransferToolbar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stock Transfers', href: '/dashboard/stock-transfers' },
];

interface ModalState {
    approve: { isOpen: boolean; transfer: StockTransfer | null };
    reject: { isOpen: boolean; transfer: StockTransfer | null };
    delete: { isOpen: boolean; transfer: StockTransfer | null };
}

export default function Index({
    stockTransfers,
    warehouses,
    products,
    filters = {},
}: StockTransfersIndexPageProps) {
    const searchForm = useForm({
        search: filters.search || '',
    });

    const [filtersState, setFiltersState] = useState(filters);
    const [modals, setModals] = useState<ModalState>({
        approve: { isOpen: false, transfer: null },
        reject: { isOpen: false, transfer: null },
        delete: { isOpen: false, transfer: null },
    });
    const [rejectReason, setRejectReason] = useState('');

    // Search with auto page reset
    useEffect(() => {
        if (!searchForm.isDirty) return;

        const timer = setTimeout(() => {
            router.get(
                '/dashboard/stock-transfers',
                {
                    ...filtersState,
                    search: searchForm.data.search,
                    page: undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchForm.data.search]);

    const handleFilterChange = (key: string, value: string | undefined) => {
        const newFilters = { ...filtersState, [key]: value };
        setFiltersState(newFilters);
        router.get('/dashboard/stock-transfers', newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        searchForm.setData({ search: '' });
        setFiltersState({});
        router.get('/dashboard/stock-transfers', {}, {
            replace: true,
            preserveState: false,
        });
    };

    const openModal = (type: keyof ModalState, transfer: StockTransfer) => {
        setModals(prev => ({ ...prev, [type]: { isOpen: true, transfer } }));
    };

    const closeModal = (type: keyof ModalState) => {
        setModals(prev => ({ ...prev, [type]: { isOpen: false, transfer: null } }));
        setRejectReason('');
    };

    const handleApprove = () => {
        if (!modals.approve.transfer) return;

        router.post(`/dashboard/stock-transfers/${modals.approve.transfer.id}/approve`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal('approve');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to approve transfer');
            },
        });
    };

    const handleReject = () => {
        if (!modals.reject.transfer) return;

        router.post(`/dashboard/stock-transfers/${modals.reject.transfer.id}/reject`, {
            reject_reason: rejectReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal('reject');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to reject transfer');
            },
        });
    };

    const handleDelete = () => {
        if (!modals.delete.transfer) return;

        router.delete(`/dashboard/stock-transfers/${modals.delete.transfer.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal('delete');
                toast.success('Transfer deleted successfully');
            },
        });
    };

    const hasActiveFilters = !!(searchForm.data.search || filtersState.from_warehouse_id ||
        filtersState.to_warehouse_id || filtersState.product_id || filtersState.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Transfers" />
            <div className="p-6">
                <StockTransferToolbar
                    searchValue={searchForm.data.search}
                    onSearchChange={(value) => searchForm.setData('search', value)}
                    onAddClick={() => router.visit('/dashboard/stock-transfers/create')}
                    onClearFilters={clearFilters}
                    isSearching={searchForm.processing}
                    hasActiveFilters={hasActiveFilters}
                    warehouses={warehouses}
                    products={products}
                    filters={filtersState}
                    onFilterChange={handleFilterChange}
                />

                <StockTransferTable
                    stockTransfers={stockTransfers.data}
                    onEdit={(transfer) => router.visit(`/dashboard/stock-transfers/${transfer.id}/edit`)}
                    onDelete={(transfer) => openModal('delete', transfer)}
                    onApprove={(transfer) => openModal('approve', transfer)}
                    onReject={(transfer) => openModal('reject', transfer)}
                />

                {/* Pagination */}
                <div className="mt-4">
                    <Pagination links={stockTransfers.links} meta={{
                        current_page: 0,
                        last_page: 0,
                        per_page: 0,
                        total: 0,
                        from: 0,
                        to: 0
                    }} />
                </div>

                {/* Approve Dialog */}
                <AlertDialog open={modals.approve.isOpen} onOpenChange={() => closeModal('approve')}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Approve Transfer?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will execute the stock transfer from{' '}
                                <strong>{modals.approve.transfer?.from_warehouse.name}</strong> to{' '}
                                <strong>{modals.approve.transfer?.to_warehouse.name}</strong> for{' '}
                                <strong>{modals.approve.transfer?.qty}</strong> units of{' '}
                                <strong>{modals.approve.transfer?.product.name}</strong>.
                                <br /><br />
                                Stock will be deducted from source warehouse using FEFO logic and added to destination warehouse.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleApprove}>
                                Approve Transfer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Reject Dialog */}
                <Dialog open={modals.reject.isOpen} onOpenChange={() => closeModal('reject')}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Transfer</DialogTitle>
                            <DialogDescription>
                                Please provide a reason for rejecting this transfer request.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                            <Label htmlFor="reject_reason">Reason (Optional)</Label>
                            <Textarea
                                id="reject_reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                rows={4}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => closeModal('reject')}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleReject}>
                                Reject Transfer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <AlertDialog open={modals.delete.isOpen} onOpenChange={() => closeModal('delete')}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Transfer?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this transfer request? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}

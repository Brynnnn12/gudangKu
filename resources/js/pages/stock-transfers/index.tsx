import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
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
import { useSearch } from '@/hooks/useSearch';
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
    const { searchValue, setSearchValue, clearSearch, isSearching, hasActiveSearch } = useSearch({
        route: '/dashboard/stock-transfers',
        initialSearch: filters.search || '',
    });

    const [filtersState, setFiltersState] = useState(filters);
    const [modals, setModals] = useState<ModalState>({
        approve: { isOpen: false, transfer: null },
        reject: { isOpen: false, transfer: null },
        delete: { isOpen: false, transfer: null },
    });
    const [rejectReason, setRejectReason] = useState('');

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
        clearSearch();
        setFiltersState({});
        router.get('/dashboard/stock-transfers', {}, {
            replace: true,
            preserveState: false,
        });
    };

    const hasActiveFilters = hasActiveSearch || Object.keys(filtersState).length > 0;

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Transfers" />
            <div className="p-6">
                <StockTransferToolbar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onAddClick={() => router.visit('/dashboard/stock-transfers/create')}
                    onClearFilters={clearFilters}
                    isSearching={isSearching}
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
                            <AlertDialogTitle>Setujui Transfer?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Ini akan mengeksekusi transfer stok dari{' '}
                                <strong>{modals.approve.transfer?.from_warehouse.name}</strong> ke{' '}
                                <strong>{modals.approve.transfer?.to_warehouse.name}</strong> untuk{' '}
                                <strong>{modals.approve.transfer?.qty}</strong> unit{' '}
                                <strong>{modals.approve.transfer?.product.name}</strong>.
                                <br /><br />
                                Stok akan dikurangi dari gudang sumber menggunakan logika FEFO dan ditambahkan ke gudang tujuan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleApprove}>
                                Setujui Transfer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Reject Dialog */}
                <Dialog open={modals.reject.isOpen} onOpenChange={() => closeModal('reject')}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tolak Transfer</DialogTitle>
                            <DialogDescription>
                                Berikan alasan untuk menolak permintaan transfer ini.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                            <Label htmlFor="reject_reason">Alasan (Opsional)</Label>
                            <Textarea
                                id="reject_reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Masukkan alasan penolakan..."
                                rows={4}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => closeModal('reject')}>
                                Batal
                            </Button>
                            <Button variant="destructive" onClick={handleReject}>
                                Tolak Transfer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <AlertDialog open={modals.delete.isOpen} onOpenChange={() => closeModal('delete')}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Transfer?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus permintaan transfer ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}

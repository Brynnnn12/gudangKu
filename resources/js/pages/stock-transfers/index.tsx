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
import { useGenericModals, type ModalWithData } from '@/hooks/useGenericModals';
import { useSearch } from '@/hooks/useSearch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type {
    StockTransfer,
    StockTransfersIndexPageProps,
} from '@/types/models/stock-transfers';
import { CreateStockTransferModal } from './components/CreateStockTransferModal';
import { EditStockTransferModal } from './components/EditStockTransferModal';
import { ShowStockTransferModal } from './components/ShowStockTransferModal';
import { StockTransferTable } from './components/StockTransferTable';
import { StockTransferToolbar } from './components/StockTransferToolbar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stock Transfers', href: '/dashboard/stock-transfers' },
];

export default function Index({
    stockTransfers,
    warehouses,
    products,
    warehouseStocks,
    user,
    filters = {},
}: StockTransfersIndexPageProps) {
    const { searchValue, setSearchValue, clearSearch, isSearching, hasActiveSearch } = useSearch({
        route: '/dashboard/stock-transfers',
        initialSearch: filters.search || '',
    });

    const [filtersState, setFiltersState] = useState(filters);
    const { modals, openModal, closeModal } = useGenericModals<StockTransfer>({
        simple: ['create'],
        withData: ['edit', 'show', 'approve', 'reject', 'delete']
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

    const handleCloseModal = (type: 'approve' | 'reject' | 'delete') => {
        closeModal(type);
        if (type === 'reject') {
            setRejectReason('');
        }
    };

    const handleApprove = () => {
        const approveModal = modals.approve as ModalWithData<StockTransfer>;
        if (!approveModal.data) return;

        router.post(`/dashboard/stock-transfers/${approveModal.data.id}/approve`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                handleCloseModal('approve');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to approve transfer');
            },
        });
    };

    const handleReject = () => {
        const rejectModal = modals.reject as ModalWithData<StockTransfer>;
        if (!rejectModal.data) return;

        router.post(`/dashboard/stock-transfers/${rejectModal.data.id}/reject`, {
            reject_reason: rejectReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                handleCloseModal('reject');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to reject transfer');
            },
        });
    };

    const handleDelete = () => {
        const deleteModal = modals.delete as ModalWithData<StockTransfer>;
        if (!deleteModal.data) return;

        router.delete(`/dashboard/stock-transfers/${deleteModal.data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                handleCloseModal('delete');
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
                    onAddClick={() => openModal('create')}
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
                    user={user}
                    onView={(transfer) => openModal('show', transfer)}
                    onEdit={(transfer) => openModal('edit', transfer)}
                    onDelete={(transfer) => openModal('delete', transfer)}
                    onApprove={(transfer) => openModal('approve', transfer)}
                    onReject={(transfer) => openModal('reject', transfer)}
                />

                {/* Create Modal */}
                {modals.create && (
                    <CreateStockTransferModal
                        open={modals.create as boolean}
                        warehouses={warehouses}
                        products={products}
                        warehouseStocks={warehouseStocks}
                        onClose={() => closeModal('create')}
                    />
                )}

                {/* Edit Modal */}
                {(modals.edit as ModalWithData<StockTransfer>).isOpen && (modals.edit as ModalWithData<StockTransfer>).data && (
                    <EditStockTransferModal
                        open={(modals.edit as ModalWithData<StockTransfer>).isOpen}
                        stockTransfer={(modals.edit as ModalWithData<StockTransfer>).data!}
                        warehouses={warehouses}
                        products={products}
                        warehouseStocks={warehouseStocks}
                        onClose={() => closeModal('edit')}
                    />
                )}

                {/* Show Modal */}
                {modals.show && (modals.show as ModalWithData<StockTransfer>).data && (
                    <ShowStockTransferModal
                        open={true}
                        stockTransfer={(modals.show as ModalWithData<StockTransfer>).data!}
                        onClose={() => closeModal('show')}
                    />
                )}

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
                <AlertDialog open={(modals.approve as ModalWithData<StockTransfer>).isOpen} onOpenChange={() => closeModal('approve')}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Setujui Transfer?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Ini akan mengeksekusi transfer stok dari{' '}
                                <strong>{(modals.approve as ModalWithData<StockTransfer>).data?.from_warehouse.name}</strong> ke{' '}
                                <strong>{(modals.approve as ModalWithData<StockTransfer>).data?.to_warehouse.name}</strong> untuk{' '}
                                <strong>{(modals.approve as ModalWithData<StockTransfer>).data?.qty}</strong> unit{' '}
                                <strong>{(modals.approve as ModalWithData<StockTransfer>).data?.product.name}</strong>.
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
                <Dialog open={(modals.reject as ModalWithData<StockTransfer>).isOpen} onOpenChange={() => closeModal('reject')}>
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
                <AlertDialog open={(modals.delete as ModalWithData<StockTransfer>).isOpen} onOpenChange={() => closeModal('delete')}>
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

import { Head, router } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useGenericModals, type ModalWithData } from '@/hooks/useGenericModals';
import AppLayout from '@/layouts/app-layout';
import type { StockBatch, StockBatchesIndexPageProps } from '@/types/models/stock-batches';

import CreateStockBatchModal from './components/CreateStockBatchModal';
import EditStockBatchModal from './components/EditStockBatchModal';
import { StockBatchTable } from './components/StockBatchTable';
import { StockBatchToolbar } from './components/StockBatchToolbar';

export default function StockBatchesIndex({
  stockBatches,
  warehouses,
  products,
  filters,
}: StockBatchesIndexPageProps) {
  const { modals, openModal, closeModal } = useGenericModals<StockBatch>({
    simple: ['create'],
    withData: ['edit', 'delete']
  });

  const handleDelete = () => {
    const deleteModal = modals.delete as ModalWithData<StockBatch>;
    if (!deleteModal.data) return;

    router.delete(`/dashboard/stock-batches/${deleteModal.data.id}`, {
      preserveScroll: true,
      onSuccess: () => closeModal('delete'),
    });
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Stock Batches', href: '/dashboard/stock-batches' },
      ]}
    >
      <Head title="Stock Batches (FEFO)" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Batch Stok (Pemantauan FEFO)
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Pantau batch stok dengan metode First Expired First Out (FEFO)
                </p>
              </div>

              {/* Info banner */}
              <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                <p className="font-medium">📦 Sistem FEFO (First Expired First Out)</p>
                <p className="mt-1">
                  Batch diurutkan otomatis berdasarkan tanggal kadaluarsa. Produk dengan kadaluarsa terdekat akan diprioritaskan untuk operasi keluar.
                </p>
              </div>

              {/* Toolbar with filters */}
              <StockBatchToolbar
                warehouses={warehouses}
                products={products}
                filters={filters}
                onAddClick={() => openModal('create')}
              />

              {/* Table */}
              <StockBatchTable
                stockBatches={stockBatches.data}
                onEdit={(batch: StockBatch) => openModal('edit', batch)}
                onDelete={(batch: StockBatch) => openModal('delete', batch)}
              />

              {/* Pagination */}
              {stockBatches.last_page > 1 && (
                <div className="mt-6">
                  <Pagination
                    links={stockBatches.links}
                    meta={{
                      current_page: stockBatches.current_page,
                      last_page: stockBatches.last_page,
                      per_page: stockBatches.per_page,
                      total: stockBatches.total,
                      from: (stockBatches.current_page - 1) * stockBatches.per_page + 1,
                      to: Math.min(
                        stockBatches.current_page * stockBatches.per_page,
                        stockBatches.total
                      ),
                    }}
                  />
                </div>
              )}

              {/* Modals */}
              <CreateStockBatchModal
                open={modals.create}
                warehouses={warehouses}
                products={products}
                onClose={() => closeModal('create')}
              />

              {modals.edit.isOpen && (modals.edit as ModalWithData<StockBatch>).data && (
                <EditStockBatchModal
                  open={modals.edit.isOpen}
                  stockBatch={(modals.edit as ModalWithData<StockBatch>).data!}
                  onClose={() => closeModal('edit')}
                />
              )}

              <AlertDialog open={modals.delete.isOpen} onOpenChange={(open) => !open && closeModal('delete')}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Batch Stok?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin menghapus batch{' '}
                      <strong>{(modals.delete as ModalWithData<StockBatch>).data?.batch_number}</strong>?
                      Ini akan mengurangi total stok gudang dan tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

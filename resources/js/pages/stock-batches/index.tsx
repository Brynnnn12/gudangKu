import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Pagination } from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import type { StockBatch, StockBatchesIndexPageProps } from '@/types/models/stock-batches';

import CreateStockBatchModal from './components/CreateStockBatchModal';
import EditStockBatchModal from './components/EditStockBatchModal';
import { StockBatchTable } from './components/StockBatchTable';
import { StockBatchToolbar } from './components/StockBatchToolbar';

interface ModalState {
    create: boolean;
    edit: { isOpen: boolean; stockBatch: StockBatch | null };
    delete: { isOpen: boolean; stockBatch: StockBatch | null };
}

export default function StockBatchesIndex({
  stockBatches,
  warehouses,
  products,
  filters,
}: StockBatchesIndexPageProps) {
  const [modals, setModals] = useState<ModalState>({
    create: false,
    edit: { isOpen: false, stockBatch: null },
    delete: { isOpen: false, stockBatch: null },
  });

  const openModal = (type: keyof ModalState, data?: StockBatch) => {
    if (type === 'create') {
      setModals(prev => ({ ...prev, create: true }));
    } else {
      setModals(prev => ({ ...prev, [type]: { isOpen: true, stockBatch: data || null } }));
    }
  };

  const closeModal = (type: keyof ModalState) => {
    if (type === 'create') {
      setModals(prev => ({ ...prev, create: false }));
    } else {
      setModals(prev => ({ ...prev, [type]: { isOpen: false, stockBatch: null } }));
    }
  };

  const handleDelete = () => {
    if (!modals.delete.stockBatch) return;

    router.delete(`/dashboard/stock-batches/${modals.delete.stockBatch.id}`, {
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Stock Batches (FEFO Monitoring)
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Monitor stock batches with First Expired First Out (FEFO) method
                </p>
              </div>

              {/* Info banner */}
              <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                <p className="font-medium">📦 FEFO System (First Expired First Out)</p>
                <p className="mt-1">
                  Batches are automatically sorted by expiry date. Products with nearest expiry will be
                  prioritized for outbound operations.
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

              {modals.edit.stockBatch && (
                <EditStockBatchModal
                  open={modals.edit.isOpen}
                  stockBatch={modals.edit.stockBatch}
                  onClose={() => closeModal('edit')}
                />
              )}

              <AlertDialog open={modals.delete.isOpen} onOpenChange={(open) => !open && closeModal('delete')}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Stock Batch?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete batch{' '}
                      <strong>{modals.delete.stockBatch?.batch_number}</strong>?
                      This will reduce warehouse stock totals and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
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

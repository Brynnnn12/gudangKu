import { Head,  router } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { useGenericModals, type ModalWithData } from '@/hooks/useGenericModals';
import { useSearch } from '@/hooks/useSearch';
import { useSelection } from '@/hooks/useSelection';
import AppLayout from '@/layouts/app-layout';
import CreateStockBatchModal from '@/pages/stock-batches/components/CreateStockBatchModal';
import { type BreadcrumbItem } from '@/types';
import type { Product } from '@/types/models/products';
import type { WarehouseStock, Filters, PageProps } from '@/types/models/warehouse-stocks';
import type { Warehouse } from '@/types/models/warehouses';
import StockOutModal from './components/StockOutModal';
import { WarehouseStockModals } from './components/WarehouseStockModals';
import { WarehouseStockTable } from './components/WarehouseStockTable';
import { WarehouseStockToolbar } from './components/WarehouseStockToolbar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Warehouse Stocks', href: '/dashboard/warehouse-stocks' },
];

export default function Index({
    warehouseStocks,
    warehouses,
    products,
    filters = {},
}: {
    warehouseStocks: PageProps;
    warehouses: Warehouse[];
    products: Product[];
    filters?: Filters;
}) {
    const { searchValue, setSearchValue, clearSearch, isSearching, hasActiveSearch } = useSearch({
        route: '/dashboard/warehouse-stocks',
        initialSearch: filters.search || '',
        only: ['warehouseStocks'],
    });

    const { modals, openModal, closeModal } = useGenericModals<WarehouseStock>({
        simple: ['create', 'bulkDelete'],
        withData: ['edit', 'delete', 'stockIn', 'stockOut']
    });

    const {
        selectedIds,
        toggleSelectAll,
        toggleSelectOne,
        clearSelection,
        allSelected,
        someSelected,
    } = useSelection(warehouseStocks.data);

    const handleDelete = () => {
        const deleteModal = modals.delete as ModalWithData<WarehouseStock>;
        if (!deleteModal.data) return;

        router.delete(`/dashboard/warehouse-stocks/${deleteModal.data.id}`, {
            preserveScroll: true,
            onSuccess: () => closeModal('delete'),
        });
    };

    const handleBulkDelete = () => {
        router.delete('/dashboard/warehouse-stocks/bulk-destroy', {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                clearSelection();
                closeModal('bulkDelete');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Warehouse Stocks" />
            <div className="p-6">
                <WarehouseStockToolbar
                    searchValue={searchValue}
                    warehouseId={filters.warehouse_id || ''}
                    productId={filters.product_id || ''}
                    warehouses={warehouses}
                    products={products}
                    onSearchChange={setSearchValue}
                    onWarehouseChange={(value: string) => {
                        const params = new URLSearchParams(window.location.search);
                        if (value) params.set('warehouse_id', value);
                        else params.delete('warehouse_id');
                        params.delete('page');
                        router.get(`/dashboard/warehouse-stocks?${params.toString()}`, {}, {
                            preserveState: true,
                            preserveScroll: true,
                            replace: true,
                            only: ['warehouseStocks'],
                        });
                    }}
                    onProductChange={(value: string) => {
                        const params = new URLSearchParams(window.location.search);
                        if (value) params.set('product_id', value);
                        else params.delete('product_id');
                        params.delete('page');
                        router.get(`/dashboard/warehouse-stocks?${params.toString()}`, {}, {
                            preserveState: true,
                            preserveScroll: true,
                            replace: true,
                            only: ['warehouseStocks'],
                        });
                    }}
                    onAddClick={undefined} // Disabled - stocks auto-created via batches
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={() => {
                        clearSearch();
                        router.get('/dashboard/warehouse-stocks', {}, {
                            replace: true,
                            preserveState: false,
                        });
                    }}
                    selectedCount={selectedIds.length}
                    isSearching={isSearching}
                    hasActiveFilters={hasActiveSearch || !!filters.warehouse_id || !!filters.product_id}
                />

                <WarehouseStockTable
                    warehouseStocks={warehouseStocks.data}
                    selectedIds={selectedIds}
                    onSelectAll={toggleSelectAll}
                    onSelectOne={toggleSelectOne}
                    onEdit={undefined} // Disabled - totals auto-calculated from batches
                    onStockIn={(warehouseStock: WarehouseStock) =>
                        openModal('stockIn', warehouseStock)
                    }
                    onStockOut={(warehouseStock: WarehouseStock) =>
                        openModal('stockOut', warehouseStock)
                    }
                    onDelete={(warehouseStock: WarehouseStock) =>
                        openModal('delete', warehouseStock)
                    }
                    allSelected={allSelected}
                    someSelected={someSelected}
                />

                {warehouseStocks.last_page > 1 && (
                    <div className="mt-4">
                        <Pagination
                            links={warehouseStocks.links}
                            meta={{
                                current_page: warehouseStocks.current_page,
                                last_page: warehouseStocks.last_page,
                                per_page: warehouseStocks.per_page,
                                total: warehouseStocks.total,
                                from: warehouseStocks.from,
                                to: warehouseStocks.to,
                            }}
                        />
                    </div>
                )}

                <WarehouseStockModals
                    modals={modals}
                    warehouses={warehouses}
                    products={products}
                    onCloseModal={closeModal}
                    onConfirmDelete={handleDelete}
                    onConfirmBulkDelete={handleBulkDelete}
                    selectedCount={selectedIds.length}
                />

                {/* Stock In Modal */}
                {(modals.stockIn as ModalWithData<WarehouseStock>).isOpen && (modals.stockIn as ModalWithData<WarehouseStock>).data && (
                    <CreateStockBatchModal
                        open={(modals.stockIn as ModalWithData<WarehouseStock>).isOpen}
                        warehouses={warehouses}
                        products={products}
                        preselectedWarehouseId={(modals.stockIn as ModalWithData<WarehouseStock>).data!.warehouse_id}
                        preselectedProductId={(modals.stockIn as ModalWithData<WarehouseStock>).data!.product_id}
                        onClose={() => closeModal('stockIn')}
                    />
                )}

                {/* Stock Out Modal */}
                {(modals.stockOut as ModalWithData<WarehouseStock>).isOpen && (modals.stockOut as ModalWithData<WarehouseStock>).data && (
                    <StockOutModal
                        open={(modals.stockOut as ModalWithData<WarehouseStock>).isOpen}
                        warehouseStock={(modals.stockOut as ModalWithData<WarehouseStock>).data!}
                        onClose={() => closeModal('stockOut')}
                    />
                )}
            </div>
        </AppLayout>
    );
}

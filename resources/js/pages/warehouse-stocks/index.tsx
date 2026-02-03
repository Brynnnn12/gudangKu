import { Head, router, useForm } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Pagination } from '@/components/pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGenericModals, type ModalWithData } from '@/hooks/useGenericModals';
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
    const searchForm = useForm({
        search: filters.search || '',
        warehouse_id: filters.warehouse_id || '',
        product_id: filters.product_id || '',
    });

    const { modals, openModal, closeModal } = useGenericModals<WarehouseStock>({
        simple: ['create', 'bulkDelete', 'stockIn'],
        withData: ['edit', 'delete', 'stockOut']
    });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const previousFilters = useRef({
        search: filters.search || '',
        warehouse_id: filters.warehouse_id || '',
        product_id: filters.product_id || ''
    });

    useEffect(() => {
        // Only trigger if filters actually changed
        if (previousFilters.current.search === searchForm.data.search &&
            previousFilters.current.warehouse_id === searchForm.data.warehouse_id &&
            previousFilters.current.product_id === searchForm.data.product_id) {
            return;
        }

        previousFilters.current = {
            search: searchForm.data.search,
            warehouse_id: searchForm.data.warehouse_id,
            product_id: searchForm.data.product_id
        };

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

            if (searchForm.data.warehouse_id) params.warehouse_id = searchForm.data.warehouse_id;
            else delete params.warehouse_id;

            if (searchForm.data.product_id) params.product_id = searchForm.data.product_id;
            else delete params.product_id;

            router.get(
                '/dashboard/warehouse-stocks',
                params,
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['warehouseStocks'],
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchForm.data.search, searchForm.data.warehouse_id, searchForm.data.product_id]);

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
                setSelectedIds([]);
                closeModal('bulkDelete');
            },
        });
    };

    const toggleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? warehouseStocks.data.map((ws: WarehouseStock) => ws.id) : []);
    };

    const toggleSelectOne = (id: number, checked: boolean) => {
        setSelectedIds(prev =>
            checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
        );
    };

    const clearFilters = () => {
        searchForm.setData({ search: '', warehouse_id: '', product_id: '' });
        router.get(
            '/dashboard/warehouse-stocks',
            {},
            {
                replace: true,
                preserveState: false,
            }
        );
    };

    const hasActiveFilters =
        !!searchForm.data.search || !!searchForm.data.warehouse_id || !!searchForm.data.product_id;
    const allSelected =
        warehouseStocks.data.length > 0 && selectedIds.length === warehouseStocks.data.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < warehouseStocks.data.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Warehouse Stocks" />
            <div className="p-6">
                {/* Info Banner */}
                <Alert className="mb-6">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Read-Only View</AlertTitle>
                    <AlertDescription>
                        Warehouse stock totals are automatically calculated from stock batches. To
                        add or adjust stock, please create or update{' '}
                        <a
                            href="/dashboard/stock-batches"
                            className="font-medium underline underline-offset-4 hover:text-primary"
                        >
                            Stock Batches
                        </a>
                        . Total quantities shown here reflect the sum of all active batches (FEFO).
                    </AlertDescription>
                </Alert>

                <WarehouseStockToolbar
                    searchValue={searchForm.data.search}
                    warehouseId={searchForm.data.warehouse_id}
                    productId={searchForm.data.product_id}
                    warehouses={warehouses}
                    products={products}
                    onSearchChange={(value: string) => searchForm.setData('search', value)}
                    onWarehouseChange={(value: string) => searchForm.setData('warehouse_id', value)}
                    onProductChange={(value: string) => searchForm.setData('product_id', value)}
                    onAddClick={undefined} // Disabled - stocks auto-created via batches
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={clearFilters}
                    selectedCount={selectedIds.length}
                    isSearching={searchForm.processing}
                    hasActiveFilters={hasActiveFilters}
                />

                <WarehouseStockTable
                    warehouseStocks={warehouseStocks.data}
                    selectedIds={selectedIds}
                    onSelectAll={toggleSelectAll}
                    onSelectOne={toggleSelectOne}
                    onEdit={undefined} // Disabled - totals auto-calculated from batches
                    onStockIn={() => openModal('stockIn')}
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

                {modals.stockIn.isOpen && (
                    <CreateStockBatchModal
                        open={modals.stockIn.isOpen}
                        warehouses={warehouses}
                        products={products}
                        onClose={() => closeModal('stockIn')}
                    />
                )}

                {modals.stockOut.isOpen && (modals.stockOut as ModalWithData<WarehouseStock>).data && (
                    <StockOutModal
                        open={modals.stockOut.isOpen}
                        warehouseStock={(modals.stockOut as ModalWithData<WarehouseStock>).data!}
                        onClose={() => closeModal('stockOut')}
                    />
                )}
            </div>
        </AppLayout>
    );
}

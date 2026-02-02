import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { Pagination } from '@/components/pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
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

interface ModalState {
    create: boolean;
    edit: { isOpen: boolean; warehouseStock: WarehouseStock | null };
    delete: { isOpen: boolean; warehouseStock: WarehouseStock | null };
    stockOut: { isOpen: boolean; warehouseStock: WarehouseStock | null };
    bulkDelete: boolean;
}

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

    const [modals, setModals] = useState<ModalState>({
        create: false,
        edit: { isOpen: false, warehouseStock: null },
        delete: { isOpen: false, warehouseStock: null },
        stockOut: { isOpen: false, warehouseStock: null },
        bulkDelete: false,
    });

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        if (!searchForm.isDirty) return;

        const timer = setTimeout(() => {
            router.get(
                '/dashboard/warehouse-stocks',
                {
                    search: searchForm.data.search,
                    warehouse_id: searchForm.data.warehouse_id,
                    product_id: searchForm.data.product_id,
                    page: undefined,
                },
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

    const openModal = (type: keyof ModalState, data?: WarehouseStock) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: true }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: true, warehouseStock: data || null } }));
        }
    };

    const closeModal = (type: keyof ModalState) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: false }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: false, warehouseStock: null } }));
        }
    };

    const handleDelete = () => {
        if (!modals.delete.warehouseStock) return;

        router.delete(`/dashboard/warehouse-stocks/${modals.delete.warehouseStock.id}`, {
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
                    onStockOut={(warehouseStock: WarehouseStock) =>
                        openModal('stockOut', warehouseStock)
                    }
                    onDelete={(warehouseStock: WarehouseStock) =>
                        openModal('delete', warehouseStock)
                    }
                    allSelected={allSelected}
                    someSelected={someSelected}
                />

                {warehouseStocks.data.length > 0 && (
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

                {modals.stockOut.isOpen && modals.stockOut.warehouseStock && (
                    <StockOutModal
                        open={modals.stockOut.isOpen}
                        warehouseStock={modals.stockOut.warehouseStock}
                        onClose={() => closeModal('stockOut')}
                    />
                )}
            </div>
        </AppLayout>
    );
}

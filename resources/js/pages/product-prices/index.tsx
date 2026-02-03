import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Pagination } from '@/components/pagination';
import { useFilters } from '@/hooks/useFilters';
import { useGenericModals, type ModalWithData } from '@/hooks/useGenericModals';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { ProductPrice, Filters, PageProps, ProductForSelect } from '@/types/models/product-prices';
import { ProductPriceModals } from './components/ProductPriceModals';
import { ProductPriceTable } from './components/ProductPriceTable';
import { ProductPriceToolbar } from './components/ProductPriceToolbar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Product Prices', href: '/dashboard/product-prices' },
];

export default function Index({
    productPrices,
    products,
    filters = {},
}: {
    productPrices: PageProps;
    products: ProductForSelect[];
    filters?: Filters;
}) {
    const {
        filters: activeFilters,
        setFilter,
        clearFilters,
        isFiltering,
        hasActiveFilters,
    } = useFilters({
        route: '/dashboard/product-prices',
        initialFilters: {
            search: filters.search || '',
            product_id: filters.product_id || '',
        },
        only: ['productPrices'],
    });

    const { modals, openModal, closeModal } = useGenericModals<ProductPrice>({
        simple: ['bulkDelete'],
        withData: ['edit', 'delete']
    });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleDelete = () => {
        const deleteModal = modals.delete as ModalWithData<ProductPrice>;
        if (!deleteModal.data) return;

        router.delete(`/dashboard/product-prices/${deleteModal.data.id}`, {
            preserveScroll: true,
            onSuccess: () => closeModal('delete'),
        });
    };

    const handleBulkDelete = () => {
        router.delete('/dashboard/product-prices/bulk-destroy', {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                closeModal('bulkDelete');
            },
        });
    };

    const toggleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? productPrices.data.map((p: ProductPrice) => p.id) : []);
    };

    const toggleSelectOne = (id: number, checked: boolean) => {
        setSelectedIds(prev =>
            checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
        );
    };

    const allSelected = productPrices.data.length > 0 && selectedIds.length === productPrices.data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < productPrices.data.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Prices" />
            <div className="p-6">
                <ProductPriceToolbar
                    searchValue={activeFilters.search}
                    productIdValue={activeFilters.product_id}
                    products={products}
                    onSearchChange={(value: string) => setFilter('search', value)}
                    onProductIdChange={(value: string) => setFilter('product_id', value)}
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={clearFilters}
                    selectedCount={selectedIds.length}
                    isSearching={isFiltering}
                    hasActiveFilters={hasActiveFilters}
                />

                <ProductPriceTable
                    productPrices={productPrices.data}
                    selectedIds={selectedIds}
                    onSelectAll={toggleSelectAll}
                    onSelectOne={toggleSelectOne}
                    onEdit={(productPrice: ProductPrice) => openModal('edit', productPrice)}
                    onDelete={(productPrice: ProductPrice) => openModal('delete', productPrice)}
                    allSelected={allSelected}
                    someSelected={someSelected}
                />

                {productPrices.last_page > 1 && (
                    <div className="mt-4">
                        <Pagination
                            links={productPrices.links}
                            meta={{
                                current_page: productPrices.current_page,
                                last_page: productPrices.last_page,
                                per_page: productPrices.per_page,
                                total: productPrices.total,
                                from: productPrices.from,
                                to: productPrices.to,
                            }}
                        />
                    </div>
                )}

                <ProductPriceModals
                    modals={modals}
                    products={products}
                    onCloseModal={closeModal}
                    onConfirmDelete={handleDelete}
                    onConfirmBulkDelete={handleBulkDelete}
                    selectedCount={selectedIds.length}
                />
            </div>
        </AppLayout>
    );
}

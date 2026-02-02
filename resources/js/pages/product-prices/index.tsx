import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Pagination } from '@/components/pagination';
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

interface ModalState {
    create: boolean;
    edit: { isOpen: boolean; productPrice: ProductPrice | null };
    delete: { isOpen: boolean; productPrice: ProductPrice | null };
    bulkDelete: boolean;
}

export default function Index({
    productPrices,
    products,
    filters = {},
}: {
    productPrices: PageProps;
    products: ProductForSelect[];
    filters?: Filters;
}) {
    const searchForm = useForm({
        search: filters.search || '',
        product_id: filters.product_id || '',
    });

    const [modals, setModals] = useState<ModalState>({
        create: false,
        edit: { isOpen: false, productPrice: null },
        delete: { isOpen: false, productPrice: null },
        bulkDelete: false,
    });

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        if (!searchForm.isDirty) return;

        const timer = setTimeout(() => {
            router.get(
                '/dashboard/product-prices',
                {
                    search: searchForm.data.search,
                    product_id: searchForm.data.product_id || undefined,
                    page: undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['productPrices'],
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchForm.data.search, searchForm.data.product_id]);

    const openModal = (type: keyof ModalState, data?: ProductPrice) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: true }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: true, productPrice: data || null } }));
        }
    };

    const closeModal = (type: keyof ModalState) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: false }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: false, productPrice: null } }));
        }
    };

    const handleDelete = () => {
        if (!modals.delete.productPrice) return;

        router.delete(`/dashboard/product-prices/${modals.delete.productPrice.id}`, {
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

    const clearFilters = () => {
        searchForm.setData({ search: '', product_id: '' });
        router.get('/dashboard/product-prices', {}, {
            replace: true,
            preserveState: false,
            only: ['productPrices']
        });
    };

    const hasActiveFilters = !!searchForm.data.search || !!searchForm.data.product_id;
    const allSelected = productPrices.data.length > 0 && selectedIds.length === productPrices.data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < productPrices.data.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Prices" />
            <div className="p-6">
                <ProductPriceToolbar
                    searchValue={searchForm.data.search}
                    productIdValue={searchForm.data.product_id}
                    products={products}
                    onSearchChange={(value: string) => searchForm.setData('search', value)}
                    onProductIdChange={(value: string) => searchForm.setData('product_id', value)}
                    onAddClick={() => openModal('create')}
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={clearFilters}
                    selectedCount={selectedIds.length}
                    isSearching={searchForm.processing}
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

                {productPrices.data.length > 0 && (
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

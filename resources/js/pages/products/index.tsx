import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Pagination } from '@/components/pagination';
import { useGenericModals, type ModalWithData } from '@/hooks/useGenericModals';
import { useSearch } from '@/hooks/useSearch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Product, Filters, PageProps, Category } from '@/types/models/products';
import { ProductModals } from './components/ProductModals';
import { ProductTable } from './components/ProductTable';
import { ProductToolbar } from './components/ProductToolbar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Products', href: '/dashboard/products' },
];

export default function Index({
    products,
    categories,
    filters = {},
}: {
    products: PageProps;
    categories: Category[];
    filters?: Filters;
}) {
    const { searchValue, setSearchValue, clearSearch, isSearching, hasActiveSearch } = useSearch({
        route: '/dashboard/products',
        initialSearch: filters.search || '',
        only: ['products'],
    });

    const { modals, openModal, closeModal } = useGenericModals<Product>({
        simple: ['create', 'bulkDelete'],
        withData: ['edit', 'delete']
    });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleDelete = () => {
        const deleteModal = modals.delete as ModalWithData<Product>;
        if (!deleteModal.data) return;

        router.delete(`/dashboard/products/${deleteModal.data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal('delete');
            },
        });
    };

    const handleBulkDelete = () => {
        router.delete('/dashboard/products/bulk-destroy', {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                closeModal('bulkDelete');
            },
        });
    };

    const toggleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? products.data.map((p: Product) => p.id) : []);
    };

    const toggleSelectOne = (id: number, checked: boolean) => {
        setSelectedIds(prev =>
            checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
        );
    };

    const clearFilters = () => {
        clearSearch();
    };

    const allSelected = products.data.length > 0 && selectedIds.length === products.data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < products.data.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="p-6">
                <ProductToolbar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onAddClick={() => openModal('create')}
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={clearFilters}
                    selectedCount={selectedIds.length}
                    isSearching={isSearching}
                    hasActiveFilters={hasActiveSearch}
                />

                <ProductTable
                    products={products.data}
                    selectedIds={selectedIds}
                    onSelectAll={toggleSelectAll}
                    onSelectOne={toggleSelectOne}
                    onEdit={(product: Product) => openModal('edit', product)}
                    onDelete={(product: Product) => openModal('delete', product)}
                    allSelected={allSelected}
                    someSelected={someSelected}
                />

                {products.last_page > 1 && (
                    <div className="mt-4">
                        <Pagination
                            links={products.links}
                            meta={{
                                current_page: products.current_page,
                                last_page: products.last_page,
                                per_page: products.per_page,
                                total: products.total,
                                from: products.from,
                                to: products.to,
                            }}
                        />
                    </div>
                )}

                <ProductModals
                    modals={modals}
                    categories={categories}
                    onCloseModal={closeModal}
                    onConfirmDelete={handleDelete}
                    onConfirmBulkDelete={handleBulkDelete}
                    selectedCount={selectedIds.length}
                />
            </div>
        </AppLayout>
    );
}

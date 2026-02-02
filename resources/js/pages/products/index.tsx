import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Pagination } from '@/components/pagination';
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

interface ModalState {
    create: boolean;
    edit: { isOpen: boolean; product: Product | null };
    delete: { isOpen: boolean; product: Product | null };
    bulkDelete: boolean;
}

export default function Index({
    products,
    categories,
    filters = {},
}: {
    products: PageProps;
    categories: Category[];
    filters?: Filters;
}) {
    const searchForm = useForm({
        search: filters.search || '',
    });

    const [modals, setModals] = useState<ModalState>({
        create: false,
        edit: { isOpen: false, product: null },
        delete: { isOpen: false, product: null },
        bulkDelete: false,
    });

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        if (!searchForm.isDirty) return;

        const timer = setTimeout(() => {
            router.get(
                '/dashboard/products',
                {
                    search: searchForm.data.search,
                    page: undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['products'],
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchForm.data.search]);

    const openModal = (type: keyof ModalState, data?: Product) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: true }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: true, product: data || null } }));
        }
    };

    const closeModal = (type: keyof ModalState) => {
        if (type === 'create' || type === 'bulkDelete') {
            setModals(prev => ({ ...prev, [type]: false }));
        } else {
            setModals(prev => ({ ...prev, [type]: { isOpen: false, product: null } }));
        }
    };

    const handleDelete = () => {
        if (!modals.delete.product) return;

        router.delete(`/dashboard/products/${modals.delete.product.id}`, {
            preserveScroll: true,
            onSuccess: () => closeModal('delete'),
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
        searchForm.setData({ search: '' });
        router.get('/dashboard/products', {}, {
            replace: true,
            preserveState: false
        });
    };

    const hasActiveFilters = !!searchForm.data.search;
    const allSelected = products.data.length > 0 && selectedIds.length === products.data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < products.data.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="p-6">
                <ProductToolbar
                    searchValue={searchForm.data.search}
                    onSearchChange={(value: string) => searchForm.setData('search', value)}
                    onAddClick={() => openModal('create')}
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={clearFilters}
                    selectedCount={selectedIds.length}
                    isSearching={searchForm.processing}
                    hasActiveFilters={hasActiveFilters}
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

                {products.data.length > 0 && (
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

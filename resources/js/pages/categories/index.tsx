import { Head, router } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { useGenericModals, type ModalWithData } from '@/hooks/useGenericModals';
import { useSearch } from '@/hooks/useSearch';
import { useSelection } from '@/hooks/useSelection';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Category, Filters, PageProps } from '@/types/models/categories';
import { CategoryModals } from './components/CategoryModals';
import { CategoryTable } from './components/CategoryTable';
import { CategoryToolbar } from './components/CategoryToolbar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori', href: '/dashboard/categories' },
];

export default function Index({
    categories,
    filters = {},
}: {
    categories: PageProps;
    filters?: Filters;
}) {
    const { searchValue, setSearchValue, clearSearch, isSearching, hasActiveSearch } = useSearch({
        route: '/dashboard/categories',
        initialSearch: filters.search || '',
        only: ['categories'],
    });

    const { modals, openModal, closeModal } = useGenericModals<Category>({
        simple: ['create', 'bulkDelete'],
        withData: ['edit', 'delete']
    });
    const {
        selectedIds,
        toggleSelectAll,
        toggleSelectOne,
        clearSelection,
        allSelected,
        someSelected,
        selectedCount,
    } = useSelection(categories.data);

    const handleDelete = () => {
        const deleteModal = modals.delete as ModalWithData<Category>;
        if (!deleteModal.data) return;

        router.delete(`/dashboard/categories/${deleteModal.data.id}`, {
            preserveScroll: true,
            onSuccess: () => closeModal('delete'),
        });
    };

    const handleBulkDelete = () => {
        router.delete('/dashboard/categories/bulk-destroy', {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                clearSelection();
                closeModal('bulkDelete');
            },
        });
    };

    const clearFilters = () => {
        clearSearch();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori" />
            <div className="p-6">
                <CategoryToolbar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onAddClick={() => openModal('create')}
                    onBulkDeleteClick={() => openModal('bulkDelete')}
                    onClearFilters={clearFilters}
                    selectedCount={selectedCount}
                    isSearching={isSearching}
                    hasActiveFilters={hasActiveSearch}
                />

                <CategoryTable
                    categories={categories.data}
                    selectedIds={selectedIds}
                    onSelectAll={toggleSelectAll}
                    onSelectOne={toggleSelectOne}
                    onEdit={(category) => openModal('edit', category)}
                    onDelete={(category) => openModal('delete', category)}
                    allSelected={allSelected}
                    someSelected={someSelected}
                />

                {categories.last_page > 1 && (
                    <div className="mt-6">
                        <Pagination
                            links={categories.links}
                            meta={{
                                current_page: categories.current_page,
                                last_page: categories.last_page,
                                per_page: categories.per_page,
                                total: categories.total,
                                from: categories.from,
                                to: categories.to,
                            }}
                        />
                    </div>
                )}

                <CategoryModals
                    modals={modals}
                    onCloseModal={closeModal}
                    onConfirmDelete={handleDelete}
                    onConfirmBulkDelete={handleBulkDelete}
                    selectedCount={selectedCount}
                />
            </div>
        </AppLayout>
    );
}

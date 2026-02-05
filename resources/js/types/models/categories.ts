interface Category {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    data: Category[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Filters {
    search?: string;
}

interface CategoryFormModalProps {
    open: boolean;
    category?: Category | null;
    onClose: () => void;
}

interface CategoryTableProps {
    categories: Category[];
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: number, checked: boolean) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    allSelected: boolean;
    someSelected: boolean;
}

interface CategoryToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
    onBulkDeleteClick: () => void;
    onClearFilters: () => void;
    selectedCount: number;
    isSearching: boolean;
    hasActiveFilters: boolean;
}





export type { Category, PageProps, Filters, CategoryFormModalProps, CategoryTableProps, CategoryToolbarProps };

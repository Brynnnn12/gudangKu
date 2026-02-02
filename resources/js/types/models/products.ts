export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    brand: string;
    unit: string;
    sku: string;
    category?: Category;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface Filters {
    search?: string;
}

export interface PageProps {
    data: Product[];
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

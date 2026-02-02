export interface ProductPrice {
    id: number;
    product_id: number;
    cost_price: string;
    selling_price: string;
    effective_from: string;
    created_at: string;
    updated_at: string;
    product?: {
        id: number;
        name: string;
        sku: string;
        brand: string;
        category?: {
            id: number;
            name: string;
        };
    };
}

export interface ProductForSelect {
    id: number;
    name: string;
    sku: string;
}

export interface Filters {
    search?: string;
    product_id?: number;
}

export interface PageProps {
    data: ProductPrice[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

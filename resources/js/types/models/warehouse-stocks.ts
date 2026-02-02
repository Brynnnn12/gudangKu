import type { Product } from './products';
import type { Warehouse } from './warehouses';

export interface WarehouseStock {
    id: number;
    warehouse_id: number;
    product_id: number;
    total_quantity: number;
    warehouse?: Warehouse;
    product?: Product;
    created_at: string;
    updated_at: string;
}

export interface Filters {
    search?: string;
    warehouse_id?: number;
    product_id?: number;
}

export interface PageProps {
    data: WarehouseStock[];
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

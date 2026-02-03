export interface Warehouse {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface WarehouseUser {
    id: number;
    warehouse_id: number;
    user_id: number;
    start_date: string;
    end_date?: string | null;
    warehouse?: Warehouse;
    user?: User;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface Filters {
    search?: string;
}

export interface PageProps {
    data: WarehouseUser[];
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

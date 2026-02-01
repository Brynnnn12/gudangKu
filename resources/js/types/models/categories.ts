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


export type { Category, PageProps, Filters };

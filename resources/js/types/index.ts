export type * from './auth';
export type * from './navigation';
export type * from './ui';

// Don't barrel export models to avoid naming conflicts
// Import directly from specific model files instead:
// import type { Product, Filters } from '@/types/models/products';
// import type { Warehouse } from '@/types/models/warehouses';
// etc.

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    flash?: {
        success?: string | null;
        error?: string | null;
        warning?: string | null;
        message?: string | null;
        status?: string | null;
    };
    [key: string]: unknown;
};



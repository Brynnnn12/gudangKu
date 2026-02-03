export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './models/warehouses';
export type * from './models/products';
export type * from './models/categories';
export type * from './models/employee';
export type * from './models/stock-batches';
export type * from './models/stock-logs';
export type * from './models/stock-transfers';
export type * from './models/warehouse-stocks';
export type * from './models/warehouse-users';
export type * from './models/product-prices';

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



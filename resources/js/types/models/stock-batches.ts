import type { Product } from './products';
import type { WarehouseStock } from './warehouse-stocks';
import type { Warehouse } from './warehouses';

/**
 * Stock batch status types
 */
export type StockBatchStatus = 'available' | 'expired' | 'warning';

/**
 * Stock Batch model interface (FEFO Core)
 */
export interface StockBatch {
  id: number;
  warehouse_stock_id: number;
  batch_number: string;
  expired_at: string | null;
  current_qty: number;
  cost_price: string;
  is_active: boolean;
  status: StockBatchStatus;
  created_at: string;
  updated_at: string;

  // Relationships
  warehouse_stock: WarehouseStock & {
    warehouse: Warehouse;
    product: Product;
  };
}

/**
 * Filters for stock batches listing
 */
export interface StockBatchFilters {
  search?: string;
  warehouse?: string;
  product?: string;
  status?: StockBatchStatus;
  near_expiry?: boolean;
  is_active?: boolean;
}

/**
 * Page props for stock batches index
 */
export interface StockBatchesIndexPageProps {
  stockBatches: {
    data: StockBatch[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
  warehouses: Warehouse[];
  products: Product[];
  filters: StockBatchFilters;
}

/**
 * Page props for stock batch show
 */
export interface StockBatchShowPageProps {
  stockBatch: StockBatch & {
    stock_logs: Array<{
      id: number;
      qty: number;
      type: string;
      notes: string | null;
      created_at: string;
      user: {
        id: number;
        name: string;
        email: string;
      };
    }>;
  };
}

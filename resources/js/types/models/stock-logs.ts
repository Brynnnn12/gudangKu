import type { Product } from './products';
import type { User } from './warehouse-users';
import type { Warehouse } from './warehouses';

/**
 * Stock log types (audit trail)
 */
export type StockLogType = 'entry' | 'exit' | 'transfer' | 'adjustment' | 'damage';

/**
 * Stock batch interface (simplified for stock logs)
 */
export interface StockBatch {
  id: number;
  batch_number: string;
  expiry_date: string | null;
}

/**
 * Stock Log model interface
 * Permanent audit trail - cannot be deleted or modified
 */
export interface StockLog {
  id: number;
  warehouse_id: number;
  product_id: number;
  batch_id: number | null;
  user_id: number;
  qty: number; // Positive for entry/adjustment increase, negative for exit/adjustment decrease/damage
  type: StockLogType;
  notes: string | null;
  created_at: string;
  updated_at: string;

  // Relationships
  warehouse: Warehouse;
  product: Product;
  batch: StockBatch | null;
  user: User;
}

/**
 * Filters for stock logs listing
 */
export interface StockLogFilters {
  search?: string;
  warehouse?: string;
  product?: string;
  user?: string;
  type?: StockLogType;
  date_from?: string;
  date_to?: string;
}

/**
 * Page props for stock logs index
 */
export interface StockLogsIndexPageProps {
  stockLogs: {
    data: StockLog[];
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
  users: User[];
  filters: StockLogFilters;
}

/**
 * Page props for stock log show
 */
export interface StockLogShowPageProps {
  stockLog: StockLog;
}

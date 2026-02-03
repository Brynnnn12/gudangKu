import type { User } from '../auth';
import type { Product } from './products';
import type { Warehouse } from './warehouses';

/**
 * Stock transfer status types
 */
export type StockTransferStatus = 'pending' | 'completed' | 'rejected';

/**
 * Stock Transfer model interface
 */
export interface StockTransfer {
  id: number;
  from_warehouse_id: number;
  to_warehouse_id: number;
  product_id: number;
  qty: number;
  user_id: number;
  status: StockTransferStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  reject_reason: string | null;

  // Relationships
  from_warehouse: Warehouse;
  to_warehouse: Warehouse;
  product: Product;
  user: User;
  created_by?: User;
  approved_by?: User;
  rejected_by?: User;
}

/**
 * Filters for stock transfers listing
 */
export interface StockTransferFilters {
  search?: string;
  from_warehouse_id?: string;
  to_warehouse_id?: string;
  product_id?: string;
  status?: StockTransferStatus;
  user_id?: string;
}

/**
 * Form data for creating/updating stock transfer
 */
export interface StockTransferFormData {
  from_warehouse_id: number | string;
  to_warehouse_id: number | string;
  product_id: number | string;
  qty: number | string;
  notes?: string;
}

/**
 * Page props for stock transfers index
 */
export interface StockTransfersIndexPageProps {
  stockTransfers: {
    data: StockTransfer[];
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
  filters: StockTransferFilters;
}

/**
 * Page props for stock transfer show
 */
export interface StockTransferShowPageProps {
  stockTransfer: StockTransfer;
  canUpdate: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canReject: boolean;
}

/**
 * Page props for stock transfer create/edit
 */
export interface StockTransferFormPageProps {
  stockTransfer?: StockTransfer;
  warehouses: Warehouse[];
  products: Product[];
}

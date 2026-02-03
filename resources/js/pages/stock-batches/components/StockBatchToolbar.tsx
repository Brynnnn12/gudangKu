import { router } from '@inertiajs/react';
import { Plus, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Product } from '@/types/models/products';
import type { StockBatchFilters, StockBatchStatus } from '@/types/models/stock-batches';
import type { Warehouse } from '@/types/models/warehouses';

interface StockBatchToolbarProps {
  warehouses: Warehouse[];
  products: Product[];
  filters: StockBatchFilters;
  onAddClick: () => void;
}

const statusOptions: { value: StockBatchStatus; label: string }[] = [
  { value: 'available', label: 'Tersedia' },
  { value: 'warning', label: 'Mendekati Kadaluarsa' },
  { value: 'expired', label: 'Kadaluarsa' },
];

export function StockBatchToolbar({ warehouses, products, filters, onAddClick }: StockBatchToolbarProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [warehouseId, setWarehouseId] = useState<number | undefined>(
    filters.warehouse_id ? Number(filters.warehouse_id) : undefined
  );
  const [productId, setProductId] = useState<number | undefined>(
    filters.product_id ? Number(filters.product_id) : undefined
  );
  const [status, setStatus] = useState<StockBatchStatus | undefined>(filters.status);
  const [nearExpiry, setNearExpiry] = useState(filters.near_expiry || false);
  const [isActive, setIsActive] = useState(filters.is_active || false);
  const previousSearch = useRef(filters.search || '');

  const applyFilters = () => {
    // Get current URL params to preserve pagination when filters change via select/checkbox
    const currentParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};

    // Copy all existing params except page (reset to 1 when filters change)
    currentParams.forEach((value, key) => {
      if (key !== 'page') {
        params[key] = value;
      }
    });

    // Update filter params
    if (search) params.search = search;
    else delete params.search;

    if (warehouseId) params.warehouse_id = String(warehouseId);
    else delete params.warehouse_id;

    if (productId) params.product_id = String(productId);
    else delete params.product_id;

    if (status) params.status = status;
    else delete params.status;

    if (nearExpiry) params.near_expiry = 'true';
    else delete params.near_expiry;

    if (isActive) params.is_active = 'true';
    else delete params.is_active;

    router.get(
      '/dashboard/stock-batches',
      params,
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  // Apply filters with debounce for search only
  useEffect(() => {
    // Only trigger if search actually changed
    if (previousSearch.current === search) {
      return;
    }

    previousSearch.current = search;

    const timer = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const clearFilters = () => {
    setSearch('');
    setWarehouseId(undefined);
    setProductId(undefined);
    setStatus(undefined);
    setNearExpiry(false);
    setIsActive(false);

    router.get('/dashboard/stock-batches', {}, { preserveState: true });
  };

  const hasActiveFilters =
    search || warehouseId || productId || status || nearExpiry || isActive;

  return (
    <div className="mb-6 space-y-4">
      {/* Add Stock Button */}
      <div className="flex justify-end">
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Batch Stok
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Cari berdasarkan nomor batch, gudang, atau produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Warehouse Filter */}
        <Select
          value={warehouseId ? String(warehouseId) : undefined}
          onValueChange={(value) => {
            const newValue = value ? Number(value) : undefined;
            setWarehouseId(newValue);
            setTimeout(() => applyFilters(), 0);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua Gudang" />
          </SelectTrigger>
          <SelectContent>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Product Filter */}
        <Select
          value={productId ? String(productId) : undefined}
          onValueChange={(value) => {
            const newValue = value ? Number(value) : undefined;
            setProductId(newValue);
            setTimeout(() => applyFilters(), 0);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua Produk" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={String(product.id)}>
                {product.name} ({product.sku})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={status || undefined}
          onValueChange={(value) => {
            const newValue = value as StockBatchStatus | undefined;
            setStatus(newValue);
            setTimeout(() => applyFilters(), 0);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="near_expiry"
            checked={nearExpiry}
            onCheckedChange={(checked) => {
              setNearExpiry(!!checked);
              setTimeout(() => applyFilters(), 0);
            }}
          />
          <Label
            htmlFor="near_expiry"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Hanya Mendekati Kadaluarsa
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={isActive}
            onCheckedChange={(checked) => {
              setIsActive(!!checked);
              setTimeout(() => applyFilters(), 0);
            }}
          />
          <Label
            htmlFor="is_active"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Hanya Aktif
          </Label>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button onClick={clearFilters} variant="outline" size="sm" className="w-full sm:w-auto">
          <X className="mr-2 h-4 w-4" />
          Hapus Semua Filter
        </Button>
      )}
    </div>
  );
}

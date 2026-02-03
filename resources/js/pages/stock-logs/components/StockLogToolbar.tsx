import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Product } from '@/types/models/products';
import type { StockLogFilters, StockLogType } from '@/types/models/stock-logs';
import type { User } from '@/types/models/warehouse-users';
import type { Warehouse } from '@/types/models/warehouses';

interface StockLogToolbarProps {
  warehouses: Warehouse[];
  products: Product[];
  users: User[];
  filters: StockLogFilters;
}

const stockLogTypes: { value: StockLogType; label: string }[] = [
  { value: 'entry', label: 'Masuk' },
  { value: 'exit', label: 'Keluar' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'adjustment', label: 'Penyesuaian' },
  { value: 'damage', label: 'Rusak' },
];

export function StockLogToolbar({ warehouses, products, users, filters }: StockLogToolbarProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [warehouseId, setWarehouseId] = useState<number | undefined>(
    filters.warehouse ? Number(filters.warehouse) : undefined
  );
  const [productId, setProductId] = useState<number | undefined>(
    filters.product ? Number(filters.product) : undefined
  );
  const [userId, setUserId] = useState<number | undefined>(
    filters.user ? Number(filters.user) : undefined
  );
  const [type, setType] = useState<StockLogType | undefined>(filters.type);
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const previousSearch = useRef(filters.search || '');

  const applyFilters = () => {
    // Get current URL params to preserve pagination when filters change
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

    if (warehouseId) params.warehouse = String(warehouseId);
    else delete params.warehouse;

    if (productId) params.product = String(productId);
    else delete params.product;

    if (userId) params.user = String(userId);
    else delete params.user;

    if (type) params.type = type;
    else delete params.type;

    if (dateFrom) params.date_from = dateFrom;
    else delete params.date_from;

    if (dateTo) params.date_to = dateTo;
    else delete params.date_to;

    router.get(
      '/dashboard/stock-logs',
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
    setUserId(undefined);
    setType(undefined);
    setDateFrom('');
    setDateTo('');

    router.get('/dashboard/stock-logs', {}, { preserveState: true });
  };

  const hasActiveFilters =
    search || warehouseId || productId || userId || type || dateFrom || dateTo;

  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Cari berdasarkan gudang, produk, pengguna, atau catatan..."
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
            setTimeout(() => {
              router.get(
                '/dashboard/stock-logs',
                {
                  search: search || undefined,
                  warehouse: newValue || undefined,
                  product: productId || undefined,
                  user: userId || undefined,
                  type: type || undefined,
                  date_from: dateFrom || undefined,
                  date_to: dateTo || undefined,
                },
                {
                  preserveState: true,
                  preserveScroll: true,
                }
              );
            }, 0);
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
            setTimeout(() => {
              router.get(
                '/dashboard/stock-logs',
                {
                  search: search || undefined,
                  warehouse: warehouseId || undefined,
                  product: newValue || undefined,
                  user: userId || undefined,
                  type: type || undefined,
                  date_from: dateFrom || undefined,
                  date_to: dateTo || undefined,
                },
                {
                  preserveState: true,
                  preserveScroll: true,
                }
              );
            }, 0);
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

        {/* User Filter */}
        <Select
          value={userId ? String(userId) : undefined}
          onValueChange={(value) => {
            const newValue = value ? Number(value) : undefined;
            setUserId(newValue);
            setTimeout(() => {
              router.get(
                '/dashboard/stock-logs',
                {
                  search: search || undefined,
                  warehouse: warehouseId || undefined,
                  product: productId || undefined,
                  user: newValue || undefined,
                  type: type || undefined,
                  date_from: dateFrom || undefined,
                  date_to: dateTo || undefined,
                },
                {
                  preserveState: true,
                  preserveScroll: true,
                }
              );
            }, 0);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua Pengguna" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={String(user.id)}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select
          value={type || undefined}
          onValueChange={(value) => {
            const newValue = value as StockLogType | undefined;
            setType(newValue);
            setTimeout(() => {
              router.get(
                '/dashboard/stock-logs',
                {
                  search: search || undefined,
                  warehouse: warehouseId || undefined,
                  product: productId || undefined,
                  user: userId || undefined,
                  type: newValue || undefined,
                  date_from: dateFrom || undefined,
                  date_to: dateTo || undefined,
                },
                {
                  preserveState: true,
                  preserveScroll: true,
                }
              );
            }, 0);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua Tipe" />
          </SelectTrigger>
          <SelectContent>
            {stockLogTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date From */}
        <Input
          type="date"
          placeholder="Tanggal Dari"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setTimeout(() => {
              applyFilters();
            }, 500);
          }}
        />

        {/* Date To */}
        <Input
          type="date"
          placeholder="Tanggal Sampai"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setTimeout(() => {
              applyFilters();
            }, 500);
          }}
        />
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

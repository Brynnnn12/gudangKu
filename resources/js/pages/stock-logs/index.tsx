import { Head } from '@inertiajs/react';

import { Pagination } from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import type { StockLogsIndexPageProps } from '@/types/models/stock-logs';

import { StockLogTable } from './components/StockLogTable';
import { StockLogToolbar } from './components/StockLogToolbar';

export default function StockLogsIndex({ stockLogs, warehouses, products, users, filters }: StockLogsIndexPageProps) {
  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Riwayat Stok', href: '/dashboard/stock-logs' },
      ]}
    >
      <Head title="Riwayat Stok" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Riwayat Stok
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Lihat riwayat lengkap semua perubahan dan mutasi stok
                </p>
              </div>

              {/* Toolbar with filters */}
              <StockLogToolbar
                warehouses={warehouses}
                products={products}
                users={users}
                filters={filters}
              />

              {/* Info banner */}
              <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                <p className="font-medium">📋 Jejak Audit Permanen</p>
                <p className="mt-1">
                  Riwayat stok adalah catatan permanen dari semua mutasi stok. Data tidak dapat diubah atau dihapus.
                </p>
              </div>

              {/* Table */}
              <StockLogTable stockLogs={stockLogs.data} />

              {/* Pagination */}
              {stockLogs.last_page > 1 && (
                <div className="mt-6">
                  <Pagination
                    links={stockLogs.links}
                    meta={{
                      current_page: stockLogs.current_page,
                      last_page: stockLogs.last_page,
                      per_page: stockLogs.per_page,
                      total: stockLogs.total,
                      from: (stockLogs.current_page - 1) * stockLogs.per_page + 1,
                      to: Math.min(stockLogs.current_page * stockLogs.per_page, stockLogs.total),
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

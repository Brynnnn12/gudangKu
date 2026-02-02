import { Head } from '@inertiajs/react';
import { Calendar, FileText, Hash, Package, User, Warehouse } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import type { StockLogShowPageProps } from '@/types/models/stock-logs';

// Badge colors based on type
const typeConfig = {
  entry: { label: 'Entry', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  exit: { label: 'Exit', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  transfer: { label: 'Transfer', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  adjustment: { label: 'Adjustment', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  damage: { label: 'Damage', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
};

export default function StockLogShow({ stockLog }: StockLogShowPageProps) {
  const config = typeConfig[stockLog.type];

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Stock Logs', href: '/dashboard/stock-logs' },
        { title: `#${stockLog.id}`, href: `/dashboard/stock-logs/${stockLog.id}` },
      ]}
    >
      <Head title={`Stock Log #${stockLog.id}`} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          {/* Info banner */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            <p className="font-medium">📋 Permanent Audit Trail Record</p>
            <p className="mt-1">
              This is a permanent record and cannot be modified or deleted.
            </p>
          </div>

          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Stock Log #{stockLog.id}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Created on {new Date(stockLog.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
                <Badge className={config.color}>{config.label}</Badge>
              </div>

              {/* Details Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Warehouse */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Warehouse className="mr-2 h-4 w-4" />
                    Warehouse
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {stockLog.warehouse.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {stockLog.warehouse.address || 'No address'}
                  </p>
                </div>

                {/* Product */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Package className="mr-2 h-4 w-4" />
                    Product
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {stockLog.product.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    SKU: {stockLog.product.sku}
                  </p>
                </div>

                {/* Quantity */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Hash className="mr-2 h-4 w-4" />
                    Quantity
                  </div>
                  <p
                    className={`text-2xl font-bold ${
                      stockLog.qty > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stockLog.qty > 0 ? '+' : ''}
                    {stockLog.qty.toLocaleString('id-ID')}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    {stockLog.qty > 0 ? 'Stock Increase' : 'Stock Decrease'}
                  </p>
                </div>

                {/* User */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    <User className="mr-2 h-4 w-4" />
                    Performed By
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {stockLog.user.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {stockLog.user.email}
                  </p>
                </div>

                {/* Batch (if exists) */}
                {stockLog.batch && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                    <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                      <FileText className="mr-2 h-4 w-4" />
                      Batch
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {stockLog.batch.batch_number}
                    </p>
                    {stockLog.batch.expiry_date && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Exp: {new Date(stockLog.batch.expiry_date).toLocaleDateString('id-ID')}
                      </p>
                    )}
                  </div>
                )}

                {/* Timestamp */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    Timestamp
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {new Date(stockLog.created_at).toLocaleString('id-ID')}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    {new Date(stockLog.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Notes (if exists) */}
              {stockLog.notes && (
                <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    <FileText className="mr-2 h-4 w-4" />
                    Notes
                  </div>
                  <p className="text-gray-900 dark:text-gray-100">{stockLog.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

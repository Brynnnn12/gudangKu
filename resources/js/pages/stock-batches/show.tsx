import { Head } from '@inertiajs/react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  DollarSign,
  Hash,
  Package,
  Warehouse,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import type { StockBatchShowPageProps } from '@/types/models/stock-batches';

// Status badge config
const statusConfig = {
  available: {
    label: 'Available',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    icon: CheckCircle,
  },
  warning: {
    label: 'Near Expiry',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    icon: AlertTriangle,
  },
  expired: {
    label: 'Expired',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    icon: XCircle,
  },
};

export default function StockBatchShow({ stockBatch }: StockBatchShowPageProps) {
  const config = statusConfig[stockBatch.status];
  const StatusIcon = config.icon;

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Stock Batches', href: '/dashboard/stock-batches' },
        { title: stockBatch.batch_number, href: `/dashboard/stock-batches/${stockBatch.id}` },
      ]}
    >
      <Head title={`Batch ${stockBatch.batch_number}`} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          {/* Alert banner for expired/warning */}
          {stockBatch.status !== 'available' && (
            <div
              className={`mb-6 rounded-lg p-4 text-sm ${
                stockBatch.status === 'expired'
                  ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  : 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
              }`}
            >
              <div className="flex items-center">
                <StatusIcon className="mr-2 h-5 w-5" />
                <div>
                  <p className="font-medium">
                    {stockBatch.status === 'expired'
                      ? '⚠️ Batch Expired'
                      : '⏰ Batch Near Expiry'}
                  </p>
                  <p className="mt-1">
                    {stockBatch.status === 'expired'
                      ? 'This batch has expired and should not be used for outbound operations.'
                      : 'This batch is nearing expiry. Prioritize for FEFO (First Expired First Out).'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stockBatch.batch_number}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Created on {new Date(stockBatch.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
                <Badge className={config.color}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {config.label}
                </Badge>
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
                    {stockBatch.warehouse_stock.warehouse.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {stockBatch.warehouse_stock.warehouse.address || 'No address'}
                  </p>
                </div>

                {/* Product */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Package className="mr-2 h-4 w-4" />
                    Product
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {stockBatch.warehouse_stock.product.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    SKU: {stockBatch.warehouse_stock.product.sku}
                  </p>
                </div>

                {/* Current Quantity */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Hash className="mr-2 h-4 w-4" />
                    Current Quantity
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stockBatch.current_qty.toLocaleString('id-ID')}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    {stockBatch.is_active ? 'Active batch' : 'Inactive batch'}
                  </p>
                </div>

                {/* Cost Price */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Cost Price
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Rp {parseFloat(stockBatch.cost_price).toLocaleString('id-ID')}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Per unit</p>
                </div>

                {/* Expiry Date */}
                <div
                  className={`rounded-lg border p-4 ${
                    stockBatch.status === 'expired'
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      : stockBatch.status === 'warning'
                        ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
                  }`}
                >
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    Expiry Date
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {stockBatch.expired_at
                      ? new Date(stockBatch.expired_at).toLocaleDateString('id-ID')
                      : 'No expiry date'}
                  </p>
                  {stockBatch.expired_at && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      {stockBatch.status === 'expired'
                        ? 'Expired'
                        : `${Math.ceil(
                            (new Date(stockBatch.expired_at).getTime() - Date.now()) /
                              (1000 * 60 * 60 * 24)
                          )} days remaining`}
                    </p>
                  )}
                </div>

                {/* Total Value */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-2 flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Total Value
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Rp{' '}
                    {(parseFloat(stockBatch.cost_price) * stockBatch.current_qty).toLocaleString(
                      'id-ID'
                    )}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    Cost price × quantity
                  </p>
                </div>
              </div>

              {/* Stock Logs History */}
              {stockBatch.stock_logs && stockBatch.stock_logs.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Stock Movement History
                  </h4>
                  <div className="space-y-3">
                    {stockBatch.stock_logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${
                                log.qty > 0
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {log.qty > 0 ? '+' : ''}
                              {log.qty.toLocaleString('id-ID')}
                            </span>
                            <Badge variant="outline">{log.type}</Badge>
                          </div>
                          {log.notes && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {log.notes}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                            by {log.user.name} •{' '}
                            {new Date(log.created_at).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

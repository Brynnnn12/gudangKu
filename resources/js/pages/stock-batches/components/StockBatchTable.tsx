import { Link } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Edit, Eye, Package, Trash2, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { StockBatch } from '@/types/models/stock-batches';

interface StockBatchTableProps {
  stockBatches: StockBatch[];
  onEdit: (batch: StockBatch) => void;
  onDelete: (batch: StockBatch) => void;
}

// Status badge config
const statusConfig = {
  available: {
    label: 'Tersedia',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    icon: CheckCircle,
  },
  warning: {
    label: 'Mendekati Kadaluarsa',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    icon: AlertTriangle,
  },
  expired: {
    label: 'Kadaluarsa',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    icon: XCircle,
  },
};

export function StockBatchTable({ stockBatches, onEdit, onDelete }: StockBatchTableProps) {
  if (stockBatches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Belum Ada Batch Stok</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Mulai dengan menambahkan batch stok pertama untuk memantau produk dengan sistem FEFO
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nomor Batch
            </th>
            <th scope="col" className="px-6 py-3">
              Gudang
            </th>
            <th scope="col" className="px-6 py-3">
              Produk
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Qty Saat Ini
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Harga Beli
            </th>
            <th scope="col" className="px-6 py-3">
              Tanggal Kadaluarsa
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {stockBatches.map((batch, index) => {
            const config = statusConfig[batch.status];
            const StatusIcon = config.icon;
            const isFirstBatch = index === 0;

            return (
              <tr
                key={batch.id}
                className={`border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750 ${
                  batch.status === 'expired'
                    ? 'bg-red-50 dark:bg-red-900/10'
                    : batch.status === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/10'
                      : isFirstBatch
                        ? 'bg-green-50 dark:bg-green-900/10'
                        : 'bg-white dark:bg-gray-800'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {batch.batch_number}
                    </span>
                    {isFirstBatch && batch.status === 'available' && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Prioritas FEFO
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900 dark:text-white">
                    {batch.warehouse_stock.warehouse.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {batch.warehouse_stock.product.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {batch.warehouse_stock.product.sku}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {batch.current_qty.toLocaleString('id-ID')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-gray-900 dark:text-white">
                    Rp {parseFloat(batch.cost_price).toLocaleString('id-ID')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {batch.expired_at ? (
                    <div>
                      <div className="text-gray-900 dark:text-white">
                        {new Date(batch.expired_at).toLocaleDateString('id-ID')}
                      </div>
                      {batch.status !== 'expired' && (
                        <div className="text-xs text-gray-500">
                          {Math.ceil(
                            (new Date(batch.expired_at).getTime() - new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{' '}
                          hari
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">Tidak ada kadaluarsa</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Badge className={config.color}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {config.label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/dashboard/stock-batches/${batch.id}`}>
                      <Button variant="ghost" size="sm" title="Lihat Detail">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only ml-1">Lihat</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(batch)}
                      title="Edit Batch"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only ml-1">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(batch)}
                      className="text-destructive hover:text-destructive"
                      title="Hapus Batch"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only ml-1">Hapus</span>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

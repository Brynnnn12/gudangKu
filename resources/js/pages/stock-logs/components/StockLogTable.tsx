import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { StockLog } from '@/types/models/stock-logs';

interface StockLogTableProps {
  stockLogs: StockLog[];
}

// Badge colors based on type
const typeConfig = {
  entry: { label: 'Entry', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  exit: { label: 'Exit', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  transfer: { label: 'Transfer', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  adjustment: { label: 'Adjustment', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  damage: { label: 'Damage', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
};

export function StockLogTable({ stockLogs }: StockLogTableProps) {
  if (stockLogs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">No stock logs found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Warehouse
            </th>
            <th scope="col" className="px-6 py-3">
              Product
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3">
              User
            </th>
            <th scope="col" className="px-6 py-3">
              Notes
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {stockLogs.map((log) => {
            const config = typeConfig[log.type];
            return (
              <tr
                key={log.id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
              >
                <td className="px-6 py-4 text-xs">
                  <div>{new Date(log.created_at).toLocaleDateString('id-ID')}</div>
                  <div className="text-gray-500">{new Date(log.created_at).toLocaleTimeString('id-ID')}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={config.color}>{config.label}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{log.warehouse.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{log.product.name}</div>
                  <div className="text-xs text-gray-500">{log.product.sku}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`font-bold ${
                      log.qty > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {log.qty > 0 ? '+' : ''}
                    {log.qty.toLocaleString('id-ID')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900 dark:text-white">{log.user.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs truncate text-gray-600 dark:text-gray-400">
                    {log.notes || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <Link href={`/dashboard/stock-logs/${log.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import { Link } from '@inertiajs/react';
import { Eye, History } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { StockLog } from '@/types/models/stock-logs';

interface StockLogTableProps {
  stockLogs: StockLog[];
}

const typeConfig = {
  entry: { label: 'Masuk', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  exit: { label: 'Keluar', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  transfer: { label: 'Transfer', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  adjustment: { label: 'Penyesuaian', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  damage: { label: 'Rusak', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
};

export function StockLogTable({ stockLogs }: StockLogTableProps) {
  if (stockLogs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <History className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Belum Ada Riwayat Stok</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Riwayat perubahan stok akan muncul di sini saat ada transaksi masuk, keluar, atau penyesuaian
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Waktu</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Gudang</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead className="text-right">Kuantitas</TableHead>
            <TableHead>Pengguna</TableHead>
            <TableHead>Catatan</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockLogs.map((log) => {
            const config = typeConfig[log.type];
            return (
              <TableRow key={log.id}>
                <TableCell className="text-xs">
                  <div>{new Date(log.created_at).toLocaleDateString('id-ID')}</div>
                  <div className="text-muted-foreground">{new Date(log.created_at).toLocaleTimeString('id-ID')}</div>
                </TableCell>
                <TableCell>
                  <Badge className={config.color}>{config.label}</Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{log.warehouse.name}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{log.product.name}</div>
                  <div className="text-xs text-muted-foreground">{log.product.sku}</div>
                </TableCell>
                <TableCell className="text-right">
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
                </TableCell>
                <TableCell>{log.user.name}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate text-muted-foreground">
                    {log.notes || '-'}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/stock-logs/${log.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only ml-1">Lihat</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

import { Link } from '@inertiajs/react';
import { Eye, Edit, Trash2, CheckCircle, XCircle, ArrowRightLeft } from 'lucide-react';
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
import type { StockTransfer } from '@/types/models/stock-transfers';

interface StockTransferTableProps {
    stockTransfers: StockTransfer[];
    onEdit: (transfer: StockTransfer) => void;
    onDelete: (transfer: StockTransfer) => void;
    onApprove: (transfer: StockTransfer) => void;
    onReject: (transfer: StockTransfer) => void;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending':
            return <Badge variant="secondary">Menunggu</Badge>;
        case 'completed':
            return <Badge variant="default">Selesai</Badge>;
        case 'rejected':
            return <Badge variant="destructive">Ditolak</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export function StockTransferTable({
    stockTransfers,
    onEdit,
    onDelete,
    onApprove,
    onReject,
}: StockTransferTableProps) {
    if (stockTransfers.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <ArrowRightLeft className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada Transfer</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Mulai dengan membuat transfer stok pertama antar gudang
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Dari</TableHead>
                        <TableHead className="font-semibold">Ke</TableHead>
                        <TableHead className="font-semibold">Produk</TableHead>
                        <TableHead className="text-right font-semibold">Qty</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Diminta Oleh</TableHead>
                        <TableHead className="font-semibold">Tanggal</TableHead>
                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stockTransfers.map((transfer) => (
                            <TableRow key={transfer.id} className="group">
                                <TableCell className="font-medium">#{transfer.id}</TableCell>
                                <TableCell>{transfer.from_warehouse.name}</TableCell>
                                <TableCell>{transfer.to_warehouse.name}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{transfer.product.name}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {transfer.product.sku}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{transfer.qty}</TableCell>
                                <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                                <TableCell>{transfer.user.name}</TableCell>
                                <TableCell>
                                    {new Date(transfer.created_at).toLocaleDateString('id-ID')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5"
                                            asChild
                                            title="Lihat detail"
                                        >
                                            <Link href={`/dashboard/stock-transfers/${transfer.id}`}>
                                                <Eye className="h-3.5 w-3.5" />
                                                <span className="sr-only sm:not-sr-only">Lihat</span>
                                            </Link>
                                        </Button>
                                        {transfer.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => onApprove(transfer)}
                                                    title="Setujui transfer"
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    <span className="sr-only sm:not-sr-only">Setujui</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => onReject(transfer)}
                                                    title="Tolak transfer"
                                                >
                                                    <XCircle className="h-3.5 w-3.5" />
                                                    <span className="sr-only sm:not-sr-only">Tolak</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-1.5"
                                                    onClick={() => onEdit(transfer)}
                                                    title="Edit transfer"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                    <span className="sr-only sm:not-sr-only">Edit</span>
                                                </Button>
                                            </>
                                        )}
                                        {(transfer.status === 'pending' || transfer.status === 'rejected') && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => onDelete(transfer)}
                                                title="Hapus transfer"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                <span className="sr-only sm:not-sr-only">Hapus</span>
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}

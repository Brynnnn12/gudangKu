import { Eye, Edit, Trash2, CheckCircle, XCircle, ArrowRightLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
            return <Badge variant="secondary">Pending</Badge>;
        case 'completed':
            return <Badge variant="default">Completed</Badge>;
        case 'rejected':
            return <Badge variant="destructive">Rejected</Badge>;
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
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stockTransfers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-muted-foreground">
                                No stock transfers found
                            </TableCell>
                        </TableRow>
                    ) : (
                        stockTransfers.map((transfer) => (
                            <TableRow key={transfer.id}>
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
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                            title="View details"
                                        >
                                            <Link href={`/dashboard/stock-transfers/${transfer.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        {transfer.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onApprove(transfer)}
                                                    title="Approve transfer"
                                                >
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onReject(transfer)}
                                                    title="Reject transfer"
                                                >
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEdit(transfer)}
                                                    title="Edit transfer"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                        {(transfer.status === 'pending' || transfer.status === 'rejected') && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(transfer)}
                                                title="Delete transfer"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

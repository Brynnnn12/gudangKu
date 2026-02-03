import { Calendar, Package, Truck, User, Warehouse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';
import type { StockTransfer } from '@/types/models/stock-transfers';

interface ShowStockTransferModalProps {
    open: boolean;
    stockTransfer: StockTransfer;
    onClose: () => void;
}

export function ShowStockTransferModal({
    open,
    stockTransfer,
    onClose,
}: ShowStockTransferModalProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'completed':
                return <Badge variant="default">Completed</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-semibold">Detail Transfer Stok</h2>
                            {getStatusBadge(stockTransfer.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Transfer #{stockTransfer.id}
                        </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">Dari Gudang</Label>
                                </div>
                                <p className="text-sm">{stockTransfer.from_warehouse.name}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">Ke Gudang</Label>
                                </div>
                                <p className="text-sm">{stockTransfer.to_warehouse.name}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">Produk</Label>
                                </div>
                                <p className="text-sm font-medium">{stockTransfer.product.name}</p>
                                <p className="text-xs text-muted-foreground">SKU: {stockTransfer.product.sku}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Jumlah Transfer</Label>
                                <p className="text-2xl font-bold">{stockTransfer.qty} unit</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">Dibuat Oleh</Label>
                                </div>
                                <p className="text-sm">{stockTransfer.created_by?.name || stockTransfer.user?.name || '-'}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">Tanggal Dibuat</Label>
                                </div>
                                <p className="text-sm">{formatDate(stockTransfer.created_at)}</p>
                            </div>
                        </div>

                        {stockTransfer.approved_by && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Disetujui Oleh</Label>
                                    <p className="text-sm">{stockTransfer.approved_by.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Tanggal Disetujui</Label>
                                    <p className="text-sm">{stockTransfer.approved_at ? formatDate(stockTransfer.approved_at) : '-'}</p>
                                </div>
                            </div>
                        )}

                        {stockTransfer.rejected_by && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Ditolak Oleh</Label>
                                    <p className="text-sm">{stockTransfer.rejected_by.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Tanggal Ditolak</Label>
                                    <p className="text-sm">{stockTransfer.rejected_at ? formatDate(stockTransfer.rejected_at) : '-'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {(stockTransfer.notes || stockTransfer.reject_reason) && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                {stockTransfer.notes && (
                                    <div>
                                        <Label className="text-sm font-medium">Catatan</Label>
                                        <p className="text-sm text-muted-foreground mt-1">{stockTransfer.notes}</p>
                                    </div>
                                )}

                                {stockTransfer.reject_reason && (
                                    <div>
                                        <Label className="text-sm font-medium text-destructive">Alasan Penolakan</Label>
                                        <p className="text-sm text-muted-foreground mt-1">{stockTransfer.reject_reason}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

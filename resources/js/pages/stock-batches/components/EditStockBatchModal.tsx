import { useForm } from '@inertiajs/react';
import { Calendar, DollarSign, Package, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import { ModalHeader } from '@/components/modal-header';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StockBatch } from '@/types/models/stock-batches';

interface EditStockBatchModalProps {
    open: boolean;
    stockBatch: StockBatch;
    onClose: () => void;
}

export default function EditStockBatchModal({
    open,
    stockBatch,
    onClose,
}: EditStockBatchModalProps) {
    const form = useForm({
        expired_at: stockBatch.expired_at || '',
        current_qty: stockBatch.current_qty.toString(),
        cost_price: stockBatch.cost_price.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(`/dashboard/stock-batches/${stockBatch.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleClose = () => {
        form.reset();
        form.clearErrors();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={isOpen => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-125">
                <ModalHeader
                    icon={Package}
                    title="Edit Batch Stok"
                    description="Perbarui detail batch. Mengubah kuantitas akan menghitung ulang total stok gudang."
                />
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Batch Info (Read-only) */}
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nomor Batch:</span>
                                    <span className="font-medium">{stockBatch.batch_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Gudang:</span>
                                    <span className="font-medium">
                                        {stockBatch.warehouse_stock?.warehouse?.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Produk:</span>
                                    <span className="font-medium">
                                        {stockBatch.warehouse_stock?.product?.name}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Quantity */}
                            <div className="grid gap-2">
                                <Label htmlFor="current_qty">
                                    <Package className="mr-2 inline h-4 w-4" />
                                    Kuantitas Saat Ini *
                                </Label>
                                <Input
                                    id="current_qty"
                                    type="number"
                                    min="0"
                                    value={form.data.current_qty}
                                    onChange={e => form.setData('current_qty', e.target.value)}
                                />
                                <InputError message={form.errors.current_qty} />
                                <p className="text-sm text-muted-foreground">
                                    Stok gudang akan disesuaikan otomatis
                                </p>
                            </div>

                            {/* Cost Price */}
                            <div className="grid gap-2">
                                <Label htmlFor="cost_price">
                                    <DollarSign className="mr-2 inline h-4 w-4" />
                                    Harga Beli (Rp) *
                                </Label>
                                <Input
                                    id="cost_price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.cost_price}
                                    onChange={e => form.setData('cost_price', e.target.value)}
                                />
                                <InputError message={form.errors.cost_price} />
                            </div>
                        </div>

                        {/* Expiry Date */}
                        <div className="grid gap-2">
                            <Label htmlFor="expired_at">
                                <Calendar className="mr-2 inline h-4 w-4" />
                                Tanggal Kadaluarsa (Opsional)
                            </Label>
                            <Input
                                id="expired_at"
                                type="date"
                                value={form.data.expired_at}
                                onChange={e => form.setData('expired_at', e.target.value)}
                            />
                            <InputError message={form.errors.expired_at} />
                            <p className="text-sm text-muted-foreground">
                                Kosongkan jika produk tidak memiliki tanggal kadaluarsa
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing ? 'Memperbarui...' : 'Perbarui Batch'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { WarehouseStock } from '@/types/models/warehouse-stocks';

interface StockOutModalProps {
    open: boolean;
    warehouseStock: WarehouseStock;
    onClose: () => void;
}

export default function StockOutModal({ open, warehouseStock, onClose }: StockOutModalProps) {
    const form = useForm({
        quantity: '',
        type: 'exit',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(`/dashboard/warehouse-stocks/${warehouseStock.id}/stock-out`, {
            onSuccess: () => {
                onClose();
                form.reset();
            },
        });
    };

    const maxQuantity = warehouseStock.total_quantity;
    const quantityNum = parseInt(form.data.quantity) || 0;
    const isOverStock = quantityNum > maxQuantity;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Stok Keluar</DialogTitle>
                        <DialogDescription>
                            Kurangi stok menggunakan metode FEFO. Sistem akan otomatis mengurangi dari
                            batch dengan tanggal kadaluarsa terdekat.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Info Box */}
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <div className="space-y-1 text-sm">
                                    <div>
                                        <strong>{warehouseStock.warehouse.name}</strong> -{' '}
                                        {warehouseStock.product.name}
                                    </div>
                                    <div>
                                        SKU: {warehouseStock.product.sku} | Tersedia:{' '}
                                        <strong>{maxQuantity} {warehouseStock.product.unit}</strong>
                                    </div>
                                </div>
                            </AlertDescription>
                        </Alert>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <Label htmlFor="quantity">
                                Kuantitas <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                max={maxQuantity}
                                placeholder="Masukkan jumlah yang akan dikurangi"
                                value={form.data.quantity}
                                onChange={(e) => form.setData('quantity', e.target.value)}
                                disabled={form.processing}
                            />
                            <InputError message={form.errors.quantity} />
                            {isOverStock && (
                                <p className="text-sm text-destructive">
                                    Melebihi stok tersedia ({maxQuantity})
                                </p>
                            )}
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type">
                                Tipe <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.type}
                                onValueChange={(value) => form.setData('type', value)}
                                disabled={form.processing}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="exit">Keluar (Penjualan)</SelectItem>
                                    <SelectItem value="damage">Rusak/Hilang</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.type} />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Catatan</Label>
                            <Textarea
                                id="notes"
                                placeholder="Catatan opsional (misal: nama pelanggan, alasan)"
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.target.value)}
                                rows={3}
                                disabled={form.processing}
                            />
                            <InputError message={form.errors.notes} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={form.processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing || !form.data.quantity || isOverStock}
                        >
                            {form.processing ? 'Memproses...' : 'Konfirmasi Stok Keluar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

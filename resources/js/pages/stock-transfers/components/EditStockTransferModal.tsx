import { useForm } from '@inertiajs/react';
import { ArrowRightLeft, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import { ModalHeader } from '@/components/modal-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/types/models/products';
import type { StockTransfer, StockTransferFormData } from '@/types/models/stock-transfers';
import type { Warehouse } from '@/types/models/warehouses';

interface EditStockTransferModalProps {
    open: boolean;
    stockTransfer: StockTransfer;
    warehouses: Warehouse[];
    products: Product[];
    onClose: () => void;
}

export function EditStockTransferModal({
    open,
    stockTransfer,
    warehouses,
    products,
    onClose,
}: EditStockTransferModalProps) {
    const form = useForm<StockTransferFormData>({
        from_warehouse_id: stockTransfer.from_warehouse_id.toString(),
        to_warehouse_id: stockTransfer.to_warehouse_id.toString(),
        product_id: stockTransfer.product_id.toString(),
        qty: stockTransfer.qty.toString(),
        notes: stockTransfer.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/dashboard/stock-transfers/${stockTransfer.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleClose = () => {
        form.clearErrors();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <ModalHeader
                    icon={ArrowRightLeft}
                    title="Edit Transfer Stok"
                    description="Ubah detail permintaan transfer stok"
                />
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="from_warehouse_id">
                                    Dari Gudang <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={form.data.from_warehouse_id.toString()}
                                    onValueChange={(value) => form.setData('from_warehouse_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih gudang asal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses.map((warehouse) => (
                                            <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                {warehouse.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.from_warehouse_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="to_warehouse_id">
                                    Ke Gudang <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={form.data.to_warehouse_id.toString()}
                                    onValueChange={(value) => form.setData('to_warehouse_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih gudang tujuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses.map((warehouse) => (
                                            <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                {warehouse.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.to_warehouse_id} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="product_id">
                                Produk <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.product_id.toString()}
                                onValueChange={(value) => form.setData('product_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih produk" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={product.id.toString()}>
                                            {product.sku} - {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.product_id} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="qty">
                                Jumlah <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="qty"
                                type="number"
                                min="1"
                                value={form.data.qty}
                                onChange={(e) => form.setData('qty', e.target.value)}
                                placeholder="Masukkan jumlah yang akan ditransfer"
                            />
                            <InputError message={form.errors.qty} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Catatan</Label>
                            <Textarea
                                id="notes"
                                value={form.data.notes}
                                onChange={(e) => form.setData('notes', e.target.value)}
                                placeholder="Catatan tambahan atau alasan transfer..."
                                rows={4}
                            />
                            <InputError message={form.errors.notes} />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

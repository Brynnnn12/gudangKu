import { useForm, usePage } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
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
import { useAuth } from '@/hooks/use-auth';
import type { SharedData } from '@/types';
import type { Product } from '@/types/models/products';
import type { WarehouseStock } from '@/types/models/warehouse-stocks';
import type { Warehouse } from '@/types/models/warehouses';
import ProductCombobox from './ProductCombobox';
import StockInfoAlert from './StockInfoAlert';
import WarehouseCombobox from './WarehouseCombobox';

interface StockOutModalProps {
    open: boolean;
    warehouseStock?: WarehouseStock;
    warehouseStocks?: WarehouseStock[];
    warehouses: Warehouse[];
    products: Product[];
    onClose: () => void;
}

export default function StockOutModal({ open, warehouseStock, warehouseStocks = [], warehouses, products, onClose }: StockOutModalProps) {
    const [warehouseSearchOpen, setWarehouseSearchOpen] = useState(false);
    const [productSearchOpen, setProductSearchOpen] = useState(false);
    const { isSuperAdmin } = useAuth();
    const { auth } = usePage<SharedData>().props;
    const assignedWarehouses = auth.assignedWarehouses || [];

    const availableWarehouses = isSuperAdmin
        ? warehouses
        : warehouses.filter(w => assignedWarehouses.some(aw => aw.id === w.id));

    const defaultWarehouseId = warehouseStock?.warehouse_id?.toString()
        || (!isSuperAdmin && assignedWarehouses.length === 1
            ? String(assignedWarehouses[0].id)
            : '');

    const form = useForm({
        warehouse_id: defaultWarehouseId,
        product_id: warehouseStock?.product_id?.toString() || '',
        quantity: '',
        type: 'exit',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post('/dashboard/warehouse-stocks/stock-out', {
            onSuccess: () => {
                onClose();
                form.reset();
                setWarehouseSearchOpen(false);
                setProductSearchOpen(false);
            },
        });
    };

    const selectedWarehouse = warehouses.find(w => w.id.toString() === form.data.warehouse_id);
    const selectedProduct = products.find(p => p.id.toString() === form.data.product_id);

    const availableProducts = form.data.warehouse_id
        ? products.filter(p =>
            warehouseStocks.some(ws =>
                ws.warehouse_id.toString() === form.data.warehouse_id &&
                ws.product_id === p.id &&
                (ws.total_quantity || 0) > 0
            )
          )
        : products;

    const selectedStock = warehouseStock || (
        form.data.warehouse_id && form.data.product_id
            ? warehouseStocks.find(
                ws => ws.warehouse_id.toString() === form.data.warehouse_id &&
                      ws.product_id.toString() === form.data.product_id
              )
            : undefined
    );

    const maxQuantity = selectedStock?.total_quantity || 0;
    const quantityNum = parseInt(form.data.quantity) || 0;
    const isOverStock = quantityNum > maxQuantity;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Stok Keluar</DialogTitle>
                        <DialogDescription>
                            Kurangi stok menggunakan metode FEFO. Sistem akan otomatis mengurangi dari
                            batch dengan tanggal kadaluarsa terdekat.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <WarehouseCombobox
                            value={form.data.warehouse_id}
                            warehouses={availableWarehouses}
                            disabled={!!warehouseStock || form.processing || !isSuperAdmin}
                            error={form.errors.warehouse_id}
                            open={warehouseSearchOpen}
                            onOpenChange={setWarehouseSearchOpen}
                            onChange={(id) => form.setData('warehouse_id', id)}
                        />

                        <ProductCombobox
                            value={form.data.product_id}
                            products={availableProducts}
                            disabled={!!warehouseStock || form.processing || !form.data.warehouse_id}
                            error={form.errors.product_id}
                            emptyMessage={
                                form.data.warehouse_id
                                    ? 'Tidak ada produk dengan stok di gudang ini.'
                                    : 'Produk tidak ditemukan.'
                            }
                            open={productSearchOpen}
                            onOpenChange={setProductSearchOpen}
                            onChange={(id) => form.setData('product_id', id)}
                        />

                        {selectedStock && (
                            <StockInfoAlert
                                warehouseName={selectedWarehouse?.name || selectedStock.warehouse?.name}
                                productName={selectedProduct?.name || selectedStock.product?.name}
                                productSku={selectedProduct?.sku || selectedStock.product?.sku}
                                productUnit={selectedProduct?.unit || selectedStock.product?.unit}
                                quantity={maxQuantity}
                            />
                        )}

                        {/* Warning if no stock found */}
                        {form.data.warehouse_id && form.data.product_id && !selectedStock && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Tidak ada stok untuk kombinasi gudang dan produk ini.
                                </AlertDescription>
                            </Alert>
                        )}

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
                            disabled={form.processing || !form.data.warehouse_id || !form.data.product_id || !form.data.quantity || isOverStock}
                        >
                            {form.processing ? 'Memproses...' : 'Konfirmasi Stok Keluar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

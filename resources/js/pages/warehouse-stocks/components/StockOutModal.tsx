import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { AlertCircle, Check, ChevronsUpDown } from 'lucide-react';
import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/models/products';
import type { WarehouseStock } from '@/types/models/warehouse-stocks';
import type { Warehouse } from '@/types/models/warehouses';

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

    const form = useForm({
        warehouse_id: warehouseStock?.warehouse_id?.toString() || '',
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

    // Find selected warehouse and product for display
    const selectedWarehouse = warehouses.find(w => w.id.toString() === form.data.warehouse_id);
    const selectedProduct = products.find(p => p.id.toString() === form.data.product_id);

    // Find selected warehouse stock for available quantity
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
                        {/* Warehouse Selection - Combobox with Search */}
                        <div className="space-y-2">
                            <Label htmlFor="warehouse">
                                Gudang <span className="text-destructive">*</span>
                            </Label>
                            <Popover open={warehouseSearchOpen} onOpenChange={setWarehouseSearchOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="warehouse"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={warehouseSearchOpen}
                                        disabled={!!warehouseStock || form.processing}
                                        className={cn(
                                            'w-full justify-between',
                                            !form.data.warehouse_id && 'text-muted-foreground'
                                        )}
                                    >
                                        {selectedWarehouse ? selectedWarehouse.name : 'Cari gudang...'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Ketik nama gudang..." />
                                        <CommandList>
                                            <CommandEmpty>Gudang tidak ditemukan.</CommandEmpty>
                                            <CommandGroup>
                                                {warehouses.map((warehouse) => (
                                                    <CommandItem
                                                        key={warehouse.id}
                                                        value={warehouse.name}
                                                        onSelect={() => {
                                                            form.setData('warehouse_id', warehouse.id.toString());
                                                            setWarehouseSearchOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                form.data.warehouse_id === warehouse.id.toString()
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
                                                            )}
                                                        />
                                                        {warehouse.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={form.errors.warehouse_id} />
                        </div>

                        {/* Product Selection - Combobox with Search */}
                        <div className="space-y-2">
                            <Label htmlFor="product">
                                Produk <span className="text-destructive">*</span>
                            </Label>
                            <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="product"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={productSearchOpen}
                                        disabled={!!warehouseStock || form.processing}
                                        className={cn(
                                            'w-full justify-between',
                                            !form.data.product_id && 'text-muted-foreground'
                                        )}
                                    >
                                        {selectedProduct
                                            ? `${selectedProduct.name} - ${selectedProduct.sku}`
                                            : 'Cari produk...'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Ketik nama produk atau SKU..." />
                                        <CommandList>
                                            <CommandEmpty>Produk tidak ditemukan.</CommandEmpty>
                                            <CommandGroup>
                                                {products.map((product) => (
                                                    <CommandItem
                                                        key={product.id}
                                                        value={`${product.name} ${product.sku}`}
                                                        onSelect={() => {
                                                            form.setData('product_id', product.id.toString());
                                                            setProductSearchOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                form.data.product_id === product.id.toString()
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
                                                            )}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{product.name}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                SKU: {product.sku}
                                                            </span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={form.errors.product_id} />
                        </div>

                        {/* Info Box - Show when stock is selected */}
                        {selectedStock && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <div className="space-y-1 text-sm">
                                        <div>
                                            <strong>
                                                {selectedWarehouse?.name || selectedStock.warehouse?.name}
                                            </strong>{' '}
                                            -{' '}
                                            {selectedProduct?.name || selectedStock.product?.name}
                                        </div>
                                        <div>
                                            SKU: {selectedProduct?.sku || selectedStock.product?.sku} | Tersedia:{' '}
                                            <strong>
                                                {maxQuantity} {selectedProduct?.unit || selectedStock.product?.unit}
                                            </strong>
                                        </div>
                                    </div>
                                </AlertDescription>
                            </Alert>
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

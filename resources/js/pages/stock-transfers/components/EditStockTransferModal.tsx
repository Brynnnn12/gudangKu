import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ArrowRightLeft, Check, ChevronsUpDown, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import { ModalHeader } from '@/components/modal-header';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/models/products';
import type { StockTransfer, StockTransferFormData } from '@/types/models/stock-transfers';
import type { WarehouseStock } from '@/types/models/warehouse-stocks';
import type { Warehouse } from '@/types/models/warehouses';

interface EditStockTransferModalProps {
    open: boolean;
    stockTransfer: StockTransfer;
    warehouses: Warehouse[];
    products: Product[];
    warehouseStocks: WarehouseStock[];
    onClose: () => void;
}

export function EditStockTransferModal({
    open,
    stockTransfer,
    warehouses,
    products,
    warehouseStocks,
    onClose,
}: EditStockTransferModalProps) {
    const [fromWarehouseSearchOpen, setFromWarehouseSearchOpen] = useState(false);
    const [toWarehouseSearchOpen, setToWarehouseSearchOpen] = useState(false);
    const [productSearchOpen, setProductSearchOpen] = useState(false);

    const form = useForm<StockTransferFormData>({
        from_warehouse_id: stockTransfer.from_warehouse_id.toString(),
        to_warehouse_id: stockTransfer.to_warehouse_id.toString(),
        product_id: stockTransfer.product_id.toString(),
        qty: stockTransfer.qty.toString(),
        notes: stockTransfer.notes || '',
    });

    // Filter products based on selected from_warehouse_id
    const availableProducts = useMemo(() => {
        if (!form.data.from_warehouse_id) return [];

        const warehouseStocksInWarehouse = warehouseStocks.filter(
            ws => ws.warehouse_id.toString() === form.data.from_warehouse_id && ws.total_quantity > 0
        );

        const productIds = warehouseStocksInWarehouse.map(ws => ws.product_id);
        return products.filter(p => productIds.includes(p.id));
    }, [form.data.from_warehouse_id, warehouseStocks, products]);

    // Find selected items
    const selectedFromWarehouse = warehouses.find(w => w.id.toString() === form.data.from_warehouse_id);
    const selectedToWarehouse = warehouses.find(w => w.id.toString() === form.data.to_warehouse_id);
    const selectedProduct = availableProducts.find(p => p.id.toString() === form.data.product_id);

    // Find available stock for selected product
    const availableStock = useMemo(() => {
        if (!form.data.from_warehouse_id || !form.data.product_id) return null;
        return warehouseStocks.find(
            ws => ws.warehouse_id.toString() === form.data.from_warehouse_id &&
                  ws.product_id.toString() === form.data.product_id
        );
    }, [form.data.from_warehouse_id, form.data.product_id, warehouseStocks]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/dashboard/stock-transfers/${stockTransfer.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setFromWarehouseSearchOpen(false);
                setToWarehouseSearchOpen(false);
                setProductSearchOpen(false);
                onClose();
            },
        });
    };

    const handleClose = () => {
        form.clearErrors();
        setFromWarehouseSearchOpen(false);
        setToWarehouseSearchOpen(false);
        setProductSearchOpen(false);
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
                                <Popover open={fromWarehouseSearchOpen} onOpenChange={setFromWarehouseSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="from_warehouse_id"
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={fromWarehouseSearchOpen}
                                            disabled={form.processing}
                                            className={cn(
                                                'w-full justify-between',
                                                !form.data.from_warehouse_id && 'text-muted-foreground'
                                            )}
                                        >
                                            {selectedFromWarehouse ? selectedFromWarehouse.name : 'Cari gudang asal...'}
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
                                                                form.setData('from_warehouse_id', warehouse.id.toString());
                                                                form.setData('product_id', '');
                                                                setFromWarehouseSearchOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    form.data.from_warehouse_id === warehouse.id.toString()
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
                                <InputError message={form.errors.from_warehouse_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="to_warehouse_id">
                                    Ke Gudang <span className="text-destructive">*</span>
                                </Label>
                                <Popover open={toWarehouseSearchOpen} onOpenChange={setToWarehouseSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="to_warehouse_id"
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={toWarehouseSearchOpen}
                                            disabled={form.processing}
                                            className={cn(
                                                'w-full justify-between',
                                                !form.data.to_warehouse_id && 'text-muted-foreground'
                                            )}
                                        >
                                            {selectedToWarehouse ? selectedToWarehouse.name : 'Cari gudang tujuan...'}
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
                                                                form.setData('to_warehouse_id', warehouse.id.toString());
                                                                setToWarehouseSearchOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    form.data.to_warehouse_id === warehouse.id.toString()
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
                                <InputError message={form.errors.to_warehouse_id} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="product_id">
                                Produk <span className="text-destructive">*</span>
                            </Label>
                            <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="product_id"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={productSearchOpen}
                                        disabled={!form.data.from_warehouse_id || form.processing}
                                        className={cn(
                                            'w-full justify-between',
                                            !form.data.product_id && 'text-muted-foreground'
                                        )}
                                    >
                                        {selectedProduct
                                            ? `${selectedProduct.sku} - ${selectedProduct.name}`
                                            : form.data.from_warehouse_id
                                            ? 'Cari produk...'
                                            : 'Pilih gudang asal terlebih dahulu'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Ketik nama produk atau SKU..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                {availableProducts.length === 0
                                                    ? 'Tidak ada stok tersedia di gudang ini.'
                                                    : 'Produk tidak ditemukan.'}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {availableProducts.map((product) => {
                                                    const stock = warehouseStocks.find(
                                                        ws => ws.warehouse_id.toString() === form.data.from_warehouse_id &&
                                                              ws.product_id === product.id
                                                    );
                                                    return (
                                                        <CommandItem
                                                            key={product.id}
                                                            value={`${product.name} ${product.sku} ${product.brand}`}
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
                                                                    SKU: {product.sku} | Stok: {stock?.total_quantity || 0} {product.unit}
                                                                </span>
                                                            </div>
                                                        </CommandItem>
                                                    );
                                                })}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={form.errors.product_id} />
                            {availableStock && (
                                <p className="text-sm text-muted-foreground">
                                    Stok tersedia: <strong>{availableStock.total_quantity} {selectedProduct?.unit}</strong>
                                </p>
                            )}
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

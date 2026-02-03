import { useForm } from '@inertiajs/react';
import { Package, Save } from 'lucide-react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { ModalHeader } from '@/components/modal-header';
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
import type { Product } from '@/types/models/products';
import type { WarehouseStock } from '@/types/models/warehouse-stocks';
import type { Warehouse } from '@/types/models/warehouses';

interface WarehouseStockFormModalProps {
    open: boolean;
    warehouseStock?: WarehouseStock | null;
    warehouses: Warehouse[];
    products: Product[];
    onClose: () => void;
}

export function WarehouseStockFormModal({
    open,
    warehouseStock,
    warehouses,
    products,
    onClose,
}: WarehouseStockFormModalProps) {
    const isEditing = !!warehouseStock;

    const form = useForm({
        warehouse_id: warehouseStock?.warehouse_id?.toString() || '',
        product_id: warehouseStock?.product_id?.toString() || '',
        total_quantity: warehouseStock?.total_quantity?.toString() || '',
    });

    useEffect(() => {
        if (warehouseStock) {
            form.setData({
                warehouse_id: warehouseStock.warehouse_id?.toString() || '',
                product_id: warehouseStock.product_id?.toString() || '',
                total_quantity: warehouseStock.total_quantity?.toString() || '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warehouseStock]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && warehouseStock) {
            form.patch(`/dashboard/warehouse-stocks/${warehouseStock.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            form.post('/dashboard/warehouse-stocks', {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    onClose();
                },
            });
        }
    };

    const handleClose = () => {
        form.reset();
        form.clearErrors();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={isOpen => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmit}>
                    <ModalHeader
                        icon={Package}
                        title={isEditing ? 'Edit Stok Gudang' : 'Buat Stok Gudang'}
                        description={isEditing
                            ? `Perbarui jumlah stok untuk ${warehouseStock?.product?.name} di ${warehouseStock?.warehouse?.name}`
                            : 'Tambahkan stok produk baru ke gudang'
                        }
                    />
                    <div className="space-y-4 py-4">
                        {isEditing ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-warehouse">Gudang</Label>
                                    <Input
                                        id="edit-warehouse"
                                        value={warehouseStock?.warehouse?.name}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-product">Produk</Label>
                                    <Input
                                        id="edit-product"
                                        value={`${warehouseStock?.product?.name} - ${warehouseStock?.product?.brand} (${warehouseStock?.product?.sku})`}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="create-warehouse">
                                        Gudang <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.warehouse_id}
                                        onValueChange={value => form.setData('warehouse_id', value)}
                                    >
                                        <SelectTrigger id="create-warehouse">
                                            <SelectValue placeholder="Pilih gudang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {warehouses.map(warehouse => (
                                                <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                    {warehouse.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.warehouse_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create-product">
                                        Produk <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.product_id}
                                        onValueChange={value => form.setData('product_id', value)}
                                    >
                                        <SelectTrigger id="create-product">
                                            <SelectValue placeholder="Pilih produk" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map(product => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.name} - {product.brand} ({product.sku})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.product_id} />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor={`${isEditing ? 'edit' : 'create'}-quantity`}>
                                {isEditing ? 'Total Kuantitas' : 'Kuantitas Awal'} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id={`${isEditing ? 'edit' : 'create'}-quantity`}
                                type="number"
                                min="0"
                                placeholder={isEditing ? 'Masukkan total kuantitas' : 'Masukkan kuantitas awal'}
                                value={form.data.total_quantity}
                                onChange={e => form.setData('total_quantity', e.target.value)}
                                disabled={form.processing}
                            />
                            <InputError message={form.errors.total_quantity} />
                            {isEditing && (
                                <p className="text-sm text-muted-foreground">
                                    Kuantitas saat ini: {warehouseStock?.total_quantity}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={form.processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing
                                ? (isEditing ? 'Menyimpan...' : 'Membuat...')
                                : (isEditing ? 'Simpan Perubahan' : 'Buat Stok')
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

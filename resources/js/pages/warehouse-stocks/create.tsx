import { useForm } from '@inertiajs/react';
import { Package, Save } from 'lucide-react';
import InputError from '@/components/input-error';
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
import type { Warehouse } from '@/types/models/warehouses';

interface CreateWarehouseStockModalProps {
    open: boolean;
    warehouses: Warehouse[];
    products: Product[];
    onClose: () => void;
}

export default function CreateWarehouseStockModal({
    open,
    warehouses,
    products,
    onClose,
}: CreateWarehouseStockModalProps) {
    const form = useForm({
        warehouse_id: '',
        product_id: '',
        total_quantity: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/dashboard/warehouse-stocks', {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
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
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Create Warehouse Stock</DialogTitle>
                                <DialogDescription>
                                    Add a new product stock to warehouse
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-warehouse">
                                Warehouse <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.warehouse_id}
                                onValueChange={value => form.setData('warehouse_id', value)}
                            >
                                <SelectTrigger id="create-warehouse">
                                    <SelectValue placeholder="Select warehouse" />
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
                                Product <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.product_id}
                                onValueChange={value => form.setData('product_id', value)}
                            >
                                <SelectTrigger id="create-product">
                                    <SelectValue placeholder="Select product" />
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

                        <div className="space-y-2">
                            <Label htmlFor="create-quantity">
                                Initial Quantity <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="create-quantity"
                                type="number"
                                min="0"
                                placeholder="Enter initial quantity"
                                value={form.data.total_quantity}
                                onChange={e => form.setData('total_quantity', e.target.value)}
                                disabled={form.processing}
                            />
                            <InputError message={form.errors.total_quantity} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={form.processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing ? 'Creating...' : 'Create Stock'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

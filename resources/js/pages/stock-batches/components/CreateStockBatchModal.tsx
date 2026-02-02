import { useForm } from '@inertiajs/react';
import { Calendar, DollarSign, Hash, Package, Save } from 'lucide-react';
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

interface CreateStockBatchModalProps {
    open: boolean;
    warehouses: Warehouse[];
    products: Product[];
    onClose: () => void;
}

export default function CreateStockBatchModal({
    open,
    warehouses,
    products,
    onClose,
}: CreateStockBatchModalProps) {
    const form = useForm({
        warehouse_id: '',
        product_id: '',
        batch_number: '',
        expired_at: '',
        current_qty: '',
        cost_price: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/dashboard/stock-batches', {
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

    // Generate batch number suggestion
    const generateBatchNumber = () => {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        form.setData('batch_number', `BATCH-${timestamp}-${random}`);
    };

    return (
        <Dialog open={open} onOpenChange={isOpen => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-150">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Add Stock Batch (Stock Entry)
                    </DialogTitle>
                    <DialogDescription>
                        Create a new stock batch. This will automatically update warehouse stock
                        totals.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Warehouse */}
                        <div className="grid gap-2">
                            <Label htmlFor="warehouse_id">Warehouse *</Label>
                            <Select
                                value={form.data.warehouse_id}
                                onValueChange={value => form.setData('warehouse_id', value)}
                            >
                                <SelectTrigger id="warehouse_id">
                                    <SelectValue placeholder="Select warehouse" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map(warehouse => (
                                        <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                                            {warehouse.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.warehouse_id} />
                        </div>

                        {/* Product */}
                        <div className="grid gap-2">
                            <Label htmlFor="product_id">
                                <Package className="mr-2 inline h-4 w-4" />
                                Product *
                            </Label>
                            <Select
                                value={form.data.product_id}
                                onValueChange={value => form.setData('product_id', value)}
                            >
                                <SelectTrigger id="product_id">
                                    <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map(product => (
                                        <SelectItem key={product.id} value={String(product.id)}>
                                            {product.name} - {product.brand} ({product.sku})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.product_id} />
                        </div>

                        {/* Batch Number */}
                        <div className="grid gap-2">
                            <Label htmlFor="batch_number">
                                <Hash className="mr-2 inline h-4 w-4" />
                                Batch Number *
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="batch_number"
                                    value={form.data.batch_number}
                                    onChange={e => form.setData('batch_number', e.target.value)}
                                    placeholder="e.g., BATCH-20260202-A1B2"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={generateBatchNumber}
                                >
                                    Generate
                                </Button>
                            </div>
                            <InputError message={form.errors.batch_number} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Quantity */}
                            <div className="grid gap-2">
                                <Label htmlFor="current_qty">
                                    <Package className="mr-2 inline h-4 w-4" />
                                    Quantity *
                                </Label>
                                <Input
                                    id="current_qty"
                                    type="number"
                                    min="1"
                                    value={form.data.current_qty}
                                    onChange={e => form.setData('current_qty', e.target.value)}
                                    placeholder="0"
                                />
                                <InputError message={form.errors.current_qty} />
                            </div>

                            {/* Cost Price */}
                            <div className="grid gap-2">
                                <Label htmlFor="cost_price">
                                    <DollarSign className="mr-2 inline h-4 w-4" />
                                    Cost Price (Rp) *
                                </Label>
                                <Input
                                    id="cost_price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.data.cost_price}
                                    onChange={e => form.setData('cost_price', e.target.value)}
                                    placeholder="0.00"
                                />
                                <InputError message={form.errors.cost_price} />
                            </div>
                        </div>

                        {/* Expiry Date */}
                        <div className="grid gap-2">
                            <Label htmlFor="expired_at">
                                <Calendar className="mr-2 inline h-4 w-4" />
                                Expiry Date (Optional)
                            </Label>
                            <Input
                                id="expired_at"
                                type="date"
                                value={form.data.expired_at}
                                onChange={e => form.setData('expired_at', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <InputError message={form.errors.expired_at} />
                            <p className="text-sm text-muted-foreground">
                                Leave empty if product has no expiry date
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing ? 'Creating...' : 'Create Batch'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

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
import type { WarehouseStock } from '@/types/models/warehouse-stocks';

interface EditWarehouseStockModalProps {
    open: boolean;
    warehouseStock: WarehouseStock;
    onClose: () => void;
}

export default function EditWarehouseStockModal({
    open,
    warehouseStock,
    onClose,
}: EditWarehouseStockModalProps) {
    const form = useForm({
        total_quantity: warehouseStock.total_quantity.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(`/dashboard/warehouse-stocks/${warehouseStock.id}`, {
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
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Edit Warehouse Stock</DialogTitle>
                                <DialogDescription>
                                    Update stock quantity for {warehouseStock.product?.name} at{' '}
                                    {warehouseStock.warehouse?.name}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-warehouse">Warehouse</Label>
                            <Input
                                id="edit-warehouse"
                                value={warehouseStock.warehouse?.name}
                                disabled
                                className="bg-muted"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-product">Product</Label>
                            <Input
                                id="edit-product"
                                value={`${warehouseStock.product?.name} - ${warehouseStock.product?.brand} (${warehouseStock.product?.sku})`}
                                disabled
                                className="bg-muted"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-quantity">
                                Total Quantity <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-quantity"
                                type="number"
                                min="0"
                                placeholder="Enter total quantity"
                                value={form.data.total_quantity}
                                onChange={e => form.setData('total_quantity', e.target.value)}
                                disabled={form.processing}
                            />
                            <InputError message={form.errors.total_quantity} />
                            <p className="text-sm text-muted-foreground">
                                Current quantity: {warehouseStock.total_quantity}
                            </p>
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
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

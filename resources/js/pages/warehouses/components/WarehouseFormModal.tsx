import { useForm } from '@inertiajs/react';
import { Save, Warehouse as WarehouseIcon } from 'lucide-react';
import { useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import type { Warehouse } from '@/types/models/warehouses';

interface WarehouseFormModalProps {
    open: boolean;
    warehouse?: Warehouse | null;
    onClose: () => void;
}

export function WarehouseFormModal({ open, warehouse, onClose }: WarehouseFormModalProps) {
    const isEdit = !!warehouse;

    const form = useForm({
        name: warehouse?.name || '',
        address: warehouse?.address || '',
    });

    // Reset form when warehouse changes or modal opens/closes
    useEffect(() => {
        if (open) {
            form.setData({
                name: warehouse?.name || '',
                address: warehouse?.address || '',
            });
            form.clearErrors();
        }
    }, [open, warehouse]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onClose();
            },
        };

        if (isEdit) {
            form.put(`/dashboard/warehouses/${warehouse.id}`, options);
        } else {
            form.post('/dashboard/warehouses', options);
        }
    };

    const handleClose = () => {
        form.reset();
        form.clearErrors();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <WarehouseIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>{isEdit ? 'Edit' : 'Create'} Warehouse</DialogTitle>
                                <DialogDescription>
                                    {isEdit
                                        ? 'Update warehouse information'
                                        : 'Add a new warehouse location'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="warehouse-name">
                                Warehouse Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="warehouse-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="e.g., Main Warehouse, Branch A"
                                required
                                autoFocus
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="warehouse-address">
                                Address <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="warehouse-address"
                                value={form.data.address}
                                onChange={(e) => form.setData('address', e.target.value)}
                                placeholder="Enter full address..."
                                rows={3}
                                required
                            />
                            <InputError message={form.errors.address} />
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
                            {form.processing ? `${isEdit ? 'Updating' : 'Creating'}...` : isEdit ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

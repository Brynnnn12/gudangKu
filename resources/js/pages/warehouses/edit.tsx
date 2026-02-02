import { useForm } from '@inertiajs/react';
import { MapPin, Save, Warehouse } from 'lucide-react';
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
import type { Warehouse as WarehouseType } from '@/types/models/warehouses';

interface EditWarehouseModalProps {
    open: boolean;
    warehouse: WarehouseType | null;
    onClose: () => void;
}

export default function EditWarehouseModal({ open, warehouse, onClose }: EditWarehouseModalProps) {
    const form = useForm({
        name: warehouse?.name || '',
        address: warehouse?.address || '',
    });

    useEffect(() => {
        if (warehouse) {
            form.setData({
                name: warehouse.name,
                address: warehouse.address,
            });
        }
    }, [warehouse]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!warehouse) return;

        form.put(`/dashboard/warehouses/${warehouse.id}`, {
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

    if (!warehouse) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Warehouse className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Edit Warehouse</DialogTitle>
                                <DialogDescription>
                                    Update warehouse information
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">
                                Warehouse Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="e.g., Main Warehouse, Jakarta Branch"
                                required
                                autoFocus
                                maxLength={50}
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-address">
                                Address <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="edit-address"
                                value={form.data.address}
                                onChange={(e) => form.setData('address', e.target.value)}
                                placeholder="Enter complete warehouse address..."
                                required
                                rows={4}
                                className="resize-none"
                            />
                            <InputError message={form.errors.address} />
                            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                                <span>Include street name, city, postal code, and country</span>
                            </div>
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
                            {form.processing ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

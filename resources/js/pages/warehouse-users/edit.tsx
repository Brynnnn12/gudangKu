import { useForm } from '@inertiajs/react';
import { Save, UserPlus, Warehouse as WarehouseIcon } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { WarehouseUser, User, Warehouse } from '@/types/models/warehouse-users';


interface EditWarehouseUserModalProps {
    open: boolean;
    warehouseUser: WarehouseUser | null;
    warehouses: Warehouse[];
    users: User[];
    onClose: () => void;
}

export default function EditWarehouseUserModal({ open, warehouseUser, warehouses, users, onClose }: EditWarehouseUserModalProps) {
    const form = useForm({
        warehouse_id: warehouseUser?.warehouse_id?.toString() || '',
        user_id: warehouseUser?.user_id?.toString() || '',
    });

    useEffect(() => {
        if (warehouseUser) {
            form.setData({
                warehouse_id: warehouseUser.warehouse_id?.toString() || '',
                user_id: warehouseUser.user_id?.toString() || '',
            });
        }
    }, [warehouseUser]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!warehouseUser) return;

        form.put(`/dashboard/warehouse-users/${warehouseUser.id}`, {
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

    if (!warehouseUser) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <UserPlus className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Edit Warehouse User</DialogTitle>
                                <DialogDescription>
                                    Update user warehouse assignment
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-warehouse">
                                Warehouse <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.warehouse_id}
                                onValueChange={(value) => form.setData('warehouse_id', value)}
                            >
                                <SelectTrigger id="edit-warehouse">
                                    <SelectValue placeholder="Select warehouse" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map((warehouse) => (
                                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <WarehouseIcon className="h-4 w-4" />
                                                {warehouse.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.warehouse_id} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-user">
                                User <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.user_id}
                                onValueChange={(value) => form.setData('user_id', value)}
                            >
                                <SelectTrigger id="edit-user">
                                    <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.user_id} />
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
                            {form.processing ? 'Updating...' : 'Update Assignment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

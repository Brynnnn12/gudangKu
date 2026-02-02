import { useForm } from '@inertiajs/react';
import { Save, UserPlus, Warehouse as WarehouseIcon } from 'lucide-react';
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
import type {  User, Warehouse } from '@/types/models/warehouse-users';
interface CreateWarehouseUserModalProps {
    open: boolean;
    warehouses: Warehouse[];
    users: User[];
    onClose: () => void;
}

export default function CreateWarehouseUserModal({ open, warehouses, users, onClose }: CreateWarehouseUserModalProps) {
    const form = useForm({
        warehouse_id: '',
        user_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/dashboard/warehouse-users', {
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
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <UserPlus className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Assign User to Warehouse</DialogTitle>
                                <DialogDescription>
                                    Link a user to a warehouse location
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
                                onValueChange={(value) => form.setData('warehouse_id', value)}
                            >
                                <SelectTrigger id="create-warehouse">
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
                            <Label htmlFor="create-user">
                                User <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.user_id}
                                onValueChange={(value) => form.setData('user_id', value)}
                            >
                                <SelectTrigger id="create-user">
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
                            {form.processing ? 'Creating...' : 'Create Assignment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

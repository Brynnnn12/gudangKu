import { useForm } from '@inertiajs/react';
import { Save, UserPlus, Warehouse as WarehouseIcon } from 'lucide-react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { ModalHeader } from '@/components/modal-header';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
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

interface WarehouseUserFormModalProps {
    open: boolean;
    warehouseUser?: WarehouseUser | null;
    warehouses: Warehouse[];
    users: User[];
    onClose: () => void;
}

export function WarehouseUserFormModal({
    open,
    warehouseUser,
    warehouses,
    users,
    onClose
}: WarehouseUserFormModalProps) {
    const isEditing = !!warehouseUser;

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warehouseUser]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && warehouseUser) {
            form.put(`/dashboard/warehouse-users/${warehouseUser.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            form.post('/dashboard/warehouse-users', {
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
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmit}>
                    <ModalHeader
                        icon={UserPlus}
                        title={isEditing ? 'Edit Pengguna Gudang' : 'Tetapkan Pengguna ke Gudang'}
                        description={isEditing ? 'Perbarui penugasan pengguna gudang' : 'Hubungkan pengguna dengan lokasi gudang'}
                    />
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor={`${isEditing ? 'edit' : 'create'}-warehouse`}>
                                Gudang <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.warehouse_id}
                                onValueChange={(value) => form.setData('warehouse_id', value)}
                            >
                                <SelectTrigger id={`${isEditing ? 'edit' : 'create'}-warehouse`}>
                                    <SelectValue placeholder="Pilih gudang" />
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
                            <Label htmlFor={`${isEditing ? 'edit' : 'create'}-user`}>
                                Pengguna <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.user_id}
                                onValueChange={(value) => form.setData('user_id', value)}
                            >
                                <SelectTrigger id={`${isEditing ? 'edit' : 'create'}-user`}>
                                    <SelectValue placeholder="Pilih pengguna" />
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
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing
                                ? (isEditing ? 'Memperbarui...' : 'Menyimpan...')
                                : (isEditing ? 'Perbarui' : 'Simpan')
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

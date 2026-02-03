import { useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Save, UserPlus, Warehouse as WarehouseIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
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
    const [warehouseSearchOpen, setWarehouseSearchOpen] = useState(false);
    const [userSearchOpen, setUserSearchOpen] = useState(false);

    const form = useForm({
        warehouse_id: warehouseUser?.warehouse_id?.toString() || '',
        user_id: warehouseUser?.user_id?.toString() || '',
        start_date: warehouseUser?.start_date || new Date().toISOString().split('T')[0],
    });

    const selectedWarehouse = useMemo(
        () => warehouses.find((w) => w.id.toString() === form.data.warehouse_id),
        [form.data.warehouse_id, warehouses]
    );

    const selectedUser = useMemo(
        () => users.find((u) => u.id.toString() === form.data.user_id),
        [form.data.user_id, users]
    );

    useEffect(() => {
        if (warehouseUser) {
            form.setData({
                warehouse_id: warehouseUser.warehouse_id?.toString() || '',
                user_id: warehouseUser.user_id?.toString() || '',
                start_date: warehouseUser.start_date || new Date().toISOString().split('T')[0],
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
                    // Add small delay to ensure flash message is set before closing modal
                    setTimeout(() => {
                        onClose();
                    }, 100);
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
                        title={isEditing ? 'Pindah Gudang Pengguna' : 'Tetapkan Pengguna ke Gudang'}
                        description={isEditing ? 'Pindahkan penugasan pengguna ke gudang lain' : 'Hubungkan pengguna dengan lokasi gudang'}
                    />
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor={`${isEditing ? 'edit' : 'create'}-warehouse`}>
                                Gudang <span className="text-destructive">*</span>
                            </Label>
                            <Popover open={warehouseSearchOpen} onOpenChange={setWarehouseSearchOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={warehouseSearchOpen}
                                        className="w-full justify-between"
                                    >
                                        {selectedWarehouse ? (
                                            <div className="flex items-center gap-2">
                                                <WarehouseIcon className="h-4 w-4" />
                                                {selectedWarehouse.name}
                                            </div>
                                        ) : (
                                            "Pilih gudang"
                                        )}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Cari gudang..." />
                                        <CommandList>
                                            <CommandEmpty>Gudang tidak ditemukan</CommandEmpty>
                                            <CommandGroup>
                                                {warehouses.map((warehouse) => (
                                                    <CommandItem
                                                        key={warehouse.id}
                                                        value={warehouse.name}
                                                        onSelect={() => {
                                                            form.setData('warehouse_id', warehouse.id.toString());
                                                            setWarehouseSearchOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                form.data.warehouse_id === warehouse.id.toString()
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        <WarehouseIcon className="mr-2 h-4 w-4" />
                                                        {warehouse.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError message={form.errors.warehouse_id} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`${isEditing ? 'edit' : 'create'}-user`}>
                                Pengguna <span className="text-destructive">*</span>
                            </Label>
                            {isEditing ? (
                                <div className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">{selectedUser?.name}</span>
                                        <span className="text-xs text-muted-foreground">{selectedUser?.email}</span>
                                    </div>
                                </div>
                            ) : (
                                <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={userSearchOpen}
                                            className="w-full justify-between"
                                        >
                                            {selectedUser ? (
                                                <div className="flex flex-col items-start">
                                                    <span className="font-medium">{selectedUser.name}</span>
                                                    <span className="text-xs text-muted-foreground">{selectedUser.email}</span>
                                                </div>
                                            ) : (
                                                "Pilih pengguna"
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari pengguna..." />
                                            <CommandList>
                                                <CommandEmpty>Pengguna tidak ditemukan</CommandEmpty>
                                                <CommandGroup>
                                                    {users.map((user) => (
                                                        <CommandItem
                                                            key={user.id}
                                                            value={`${user.name} ${user.email}`}
                                                            onSelect={() => {
                                                                form.setData('user_id', user.id.toString());
                                                                setUserSearchOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    form.data.user_id === user.id.toString()
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{user.name}</span>
                                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            )}
                            <InputError message={form.errors.user_id} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`${isEditing ? 'edit' : 'create'}-start-date`}>
                                Tanggal Mulai <span className="text-destructive">*</span>
                            </Label>
                            <input
                                id={`${isEditing ? 'edit' : 'create'}-start-date`}
                                type="date"
                                name="start_date"
                                value={form.data.start_date}
                                onChange={(e) => form.setData('start_date', e.target.value)}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                            />
                            <InputError message={form.errors.start_date} />
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

import { useForm } from '@inertiajs/react';
import { Save, Warehouse as WarehouseIcon } from 'lucide-react';
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
                    <ModalHeader
                        icon={WarehouseIcon}
                        title={isEdit ? 'Edit Gudang' : 'Tambah Gudang'}
                        description={isEdit ? 'Perbarui informasi gudang' : 'Tambahkan lokasi gudang baru'}
                    />
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="warehouse-name">
                                Nama Gudang <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="warehouse-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Contoh: Gudang Utama, Cabang Jakarta"
                                required
                                autoFocus
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="warehouse-address">
                                Alamat <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="warehouse-address"
                                value={form.data.address}
                                onChange={(e) => form.setData('address', e.target.value)}
                                placeholder="Masukkan alamat lengkap gudang"
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
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing ? `${isEdit ? 'Memperbarui' : 'Menyimpan'}...` : isEdit ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { useForm } from '@inertiajs/react';
import { Save, Tag } from 'lucide-react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { ModalHeader } from '@/components/modal-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {  CategoryFormModalProps } from '@/types/models/categories';


export function CategoryFormModal({ open, category, onClose }: CategoryFormModalProps) {
    const isEdit = !!category;

    const form = useForm({
        name: category?.name || '',
    });

    useEffect(() => {
        if (open) {
            form.setData('name', category?.name || '');
            form.clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, category]);

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
            form.put(`/dashboard/categories/${category.id}`, options);
        } else {
            form.post('/dashboard/categories', options);
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
                        icon={Tag}
                        title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
                        description={isEdit ? 'Perbarui informasi kategori' : 'Tambahkan kategori baru untuk mengatur produk Anda'}
                    />
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="category-name">
                                Nama Kategori <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="category-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Contoh: Elektronik, Pakaian, Makanan"
                                required
                                autoFocus
                            />
                            <InputError message={form.errors.name} />
                            {isEdit && category ? (
                                <div className="rounded-lg bg-muted/50 p-3 border border-muted">
                                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                                        Slug URL Saat Ini
                                    </p>
                                    <code className="text-sm font-mono bg-muted-foreground/10 px-2 py-1 rounded">
                                        {category.slug}
                                    </code>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="text-sm">💡</span>
                                    Slug URL ramah mesin pencari akan dibuat otomatis
                                </p>
                            )}
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

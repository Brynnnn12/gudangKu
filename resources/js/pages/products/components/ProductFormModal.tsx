import { useForm } from '@inertiajs/react';
import { Package, Save, Tag } from 'lucide-react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { ModalHeader } from '@/components/modal-header';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
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
import type { Product, Category } from '@/types/models/products';

interface ProductFormModalProps {
    open: boolean;
    product?: Product | null;
    categories: Category[];
    onClose: () => void;
}

const UNITS = ['Karton', 'Box', 'Pcs', 'Liter', 'Kg', 'Meter', 'Buah', 'Lusin', 'Pack'];

export function ProductFormModal({ open, product, categories, onClose }: ProductFormModalProps) {
    const isEditing = !!product;

    const form = useForm({
        category_id: product?.category_id?.toString() || '',
        name: product?.name || '',
        brand: product?.brand || '',
        unit: product?.unit || '',
    });

    useEffect(() => {
        if (product) {
            form.setData({
                category_id: product.category_id?.toString() || '',
                name: product.name,
                brand: product.brand,
                unit: product.unit,
            });
            form.clearErrors();
        } else {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            form.put(`/dashboard/products/${product.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            form.post('/dashboard/products', {
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
                        icon={Package}
                        title={isEditing ? 'Edit Produk' : 'Tambah Produk'}
                        description={isEditing ? 'Perbarui informasi produk' : 'Tambahkan produk baru ke inventaris Anda'}
                    />
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="product-category">
                                Kategori <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.category_id}
                                onValueChange={(value) => form.setData('category_id', value)}
                            >
                                <SelectTrigger id="product-category">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.category_id} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="product-name">
                                Nama Produk <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="product-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Contoh: Samsung Galaxy S24, Laptop Asus ROG"
                                required
                                maxLength={255}
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product-brand">
                                    Merek <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="product-brand"
                                    value={form.data.brand}
                                    onChange={(e) => form.setData('brand', e.target.value)}
                                    placeholder="Contoh: Samsung, Apple, Xiaomi"
                                    required
                                    maxLength={100}
                                />
                                <InputError message={form.errors.brand} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product-unit">
                                    Satuan <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={form.data.unit}
                                    onValueChange={(value) => form.setData('unit', value)}
                                >
                                    <SelectTrigger id="product-unit">
                                        <SelectValue placeholder="Pilih satuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UNITS.map((unit) => (
                                            <SelectItem key={unit} value={unit}>
                                                {unit}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.unit} />
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="space-y-2">
                                <Label htmlFor="product-sku">SKU (Otomatis)</Label>
                                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-mono text-sm font-medium">{product.sku}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    SKU tidak dapat diubah setelah produk dibuat
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-lg bg-muted/50 p-3 border">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium">SKU</span> akan dibuat otomatis dengan format <span className="font-mono">PRD-XXXXXX</span>
                                </p>
                            </div>
                        )}
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

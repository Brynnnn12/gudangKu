import { useForm } from '@inertiajs/react';
import { Package, Save, Tag } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Product, Category } from '@/types/models/products';

interface EditProductModalProps {
    open: boolean;
    product: Product | null;
    categories: Category[];
    onClose: () => void;
}

const UNITS = ['Karton', 'Box', 'Pcs', 'Liter', 'Kg', 'Meter', 'Buah', 'Lusin', 'Pack'];

export default function EditProductModal({ open, product, categories, onClose }: EditProductModalProps) {
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
        }
    }, [product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        form.put(`/dashboard/products/${product.id}`, {
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

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Edit Product</DialogTitle>
                                <DialogDescription>
                                    Update product information
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">
                                Category <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.category_id}
                                onValueChange={(value) => form.setData('category_id', value)}
                            >
                                <SelectTrigger id="edit-category">
                                    <SelectValue placeholder="Select category" />
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
                            <Label htmlFor="edit-name">
                                Product Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="e.g., Samsung Galaxy S24"
                                required
                                maxLength={255}
                            />
                            <InputError message={form.errors.name} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-brand">
                                    Brand <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-brand"
                                    value={form.data.brand}
                                    onChange={(e) => form.setData('brand', e.target.value)}
                                    placeholder="e.g., Samsung"
                                    required
                                    maxLength={100}
                                />
                                <InputError message={form.errors.brand} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-unit">
                                    Unit <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={form.data.unit}
                                    onValueChange={(value) => form.setData('unit', value)}
                                >
                                    <SelectTrigger id="edit-unit">
                                        <SelectValue placeholder="Select unit" />
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

                        <div className="space-y-2">
                            <Label htmlFor="edit-sku">SKU (Auto-generated)</Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="edit-sku"
                                    value={product.sku}
                                    disabled
                                    className="pl-9 font-mono bg-muted"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                SKU tidak dapat diubah setelah produk dibuat
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
                            {form.processing ? 'Updating...' : 'Update Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

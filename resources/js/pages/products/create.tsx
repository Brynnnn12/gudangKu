import { useForm } from '@inertiajs/react';
import { Package, Save } from 'lucide-react';
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
import type { Category } from '@/types/models/products';

interface CreateProductModalProps {
    open: boolean;
    categories: Category[];
    onClose: () => void;
}

const UNITS = ['Karton', 'Box', 'Pcs', 'Liter', 'Kg', 'Meter', 'Buah', 'Lusin', 'Pack'];

export default function CreateProductModal({ open, categories, onClose }: CreateProductModalProps) {
    const form = useForm({
        category_id: '',
        name: '',
        brand: '',
        unit: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/dashboard/products', {
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
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Create Product</DialogTitle>
                                <DialogDescription>
                                    Add a new product to your inventory
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-category">
                                Category <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.category_id}
                                onValueChange={(value) => form.setData('category_id', value)}
                            >
                                <SelectTrigger id="create-category">
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
                            <Label htmlFor="create-name">
                                Product Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="create-name"
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
                                <Label htmlFor="create-brand">
                                    Brand <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="create-brand"
                                    value={form.data.brand}
                                    onChange={(e) => form.setData('brand', e.target.value)}
                                    placeholder="e.g., Samsung"
                                    required
                                    maxLength={100}
                                />
                                <InputError message={form.errors.brand} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-unit">
                                    Unit <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={form.data.unit}
                                    onValueChange={(value) => form.setData('unit', value)}
                                >
                                    <SelectTrigger id="create-unit">
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

                        <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium">SKU</span> akan di-generate otomatis dengan format <span className="font-mono">PRD-XXXXXX</span>
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
                            {form.processing ? 'Creating...' : 'Create Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

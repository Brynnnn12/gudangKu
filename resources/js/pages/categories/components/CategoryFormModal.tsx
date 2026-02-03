import { useForm } from '@inertiajs/react';
import { Save, Tag } from 'lucide-react';
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
import type { Category } from '@/types/models/categories';

interface CategoryFormModalProps {
    open: boolean;
    category?: Category | null;
    onClose: () => void;
}

export function CategoryFormModal({ open, category, onClose }: CategoryFormModalProps) {
    const isEdit = !!category;

    const form = useForm({
        name: category?.name || '',
    });

    // Reset form when category changes or modal opens/closes
    useEffect(() => {
        if (open) {
            form.setData('name', category?.name || '');
            form.clearErrors();
        }
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
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Tag className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>{isEdit ? 'Edit' : 'Create'} Category</DialogTitle>
                                <DialogDescription>
                                    {isEdit
                                        ? 'Update category information'
                                        : 'Add a new category to organize your products'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="category-name">
                                Category Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="category-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="e.g., Electronics, Clothing"
                                required
                                autoFocus
                            />
                            <InputError message={form.errors.name} />
                            {isEdit && category ? (
                                <div className="rounded-lg bg-muted/50 p-2.5">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                        Current Slug
                                    </p>
                                    <code className="text-sm">{category.slug}</code>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    💡 The URL-friendly slug will be automatically generated
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
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing ? `${isEdit ? 'Updating' : 'Creating'}...` : isEdit ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

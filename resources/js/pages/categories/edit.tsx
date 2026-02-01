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

interface Category {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

interface EditCategoryModalProps {
    open: boolean;
    category: Category | null;
    onClose: () => void;
}

export default function EditCategoryModal({ open, category, onClose }: EditCategoryModalProps) {
    const form = useForm({
        name: '',
    });

    useEffect(() => {
        if (category) {
            form.setData('name', category.name);
            form.clearErrors();
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!category) return;

        form.put(`/dashboard/categories/${category.id}`, {
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
                                <Tag className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Edit Category</DialogTitle>
                                <DialogDescription>
                                    Update category information
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">
                                Category Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Enter category name"
                                required
                                autoFocus
                            />
                            <InputError message={form.errors.name} />
                            {category && (
                                <div className="rounded-lg bg-muted/50 p-2.5">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Current Slug</p>
                                    <code className="text-sm">{category.slug}</code>
                                </div>
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
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

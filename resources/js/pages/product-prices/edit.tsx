import { useForm } from '@inertiajs/react';
import { Calendar, DollarSign, Package, Save } from 'lucide-react';
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
import type { ProductPrice, ProductForSelect } from '@/types/models/product-prices';

interface EditProductPriceModalProps {
    open: boolean;
    productPrice: ProductPrice | null;
    products: ProductForSelect[];
    onClose: () => void;
}

export default function EditProductPriceModal({ open, productPrice, products, onClose }: EditProductPriceModalProps) {
    const form = useForm({
        product_id: productPrice?.product_id?.toString() || '',
        cost_price: productPrice ? Math.floor(Number(productPrice.cost_price)).toString() : '',
        selling_price: productPrice ? Math.floor(Number(productPrice.selling_price)).toString() : '',
        effective_from: productPrice?.effective_from || '',
    });

    useEffect(() => {
        if (productPrice) {
            form.setData({
                product_id: productPrice.product_id?.toString() || '',
                cost_price: Math.floor(Number(productPrice.cost_price)).toString(),
                selling_price: Math.floor(Number(productPrice.selling_price)).toString(),
                effective_from: productPrice.effective_from,
            });
        }
    }, [productPrice]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productPrice) return;

        form.put(`/dashboard/product-prices/${productPrice.id}`, {
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

    const formatCurrency = (value: string) => {
        const number = value.replace(/\D/g, '');
        return new Intl.NumberFormat('id-ID').format(Number(number));
    };

    const handlePriceChange = (field: 'cost_price' | 'selling_price', value: string) => {
        const number = value.replace(/\D/g, '');
        form.setData(field, number);
    };

    if (!productPrice) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <DollarSign className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Edit Product Price</DialogTitle>
                                <DialogDescription>
                                    Update price information
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-product">
                                Product <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.product_id}
                                onValueChange={(value) => form.setData('product_id', value)}
                            >
                                <SelectTrigger id="edit-product">
                                    <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={product.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4" />
                                                <span className="font-mono text-sm">{product.sku}</span>
                                                <span>-</span>
                                                <span>{product.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.product_id} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-cost-price">
                                    Cost Price <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        Rp
                                    </span>
                                    <Input
                                        id="edit-cost-price"
                                        value={form.data.cost_price ? formatCurrency(form.data.cost_price) : ''}
                                        onChange={(e) => handlePriceChange('cost_price', e.target.value)}
                                        placeholder="0"
                                        required
                                        className="pl-10 text-right font-mono"
                                    />
                                </div>
                                <InputError message={form.errors.cost_price} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-selling-price">
                                    Selling Price <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        Rp
                                    </span>
                                    <Input
                                        id="edit-selling-price"
                                        value={form.data.selling_price ? formatCurrency(form.data.selling_price) : ''}
                                        onChange={(e) => handlePriceChange('selling_price', e.target.value)}
                                        placeholder="0"
                                        required
                                        className="pl-10 text-right font-mono"
                                    />
                                </div>
                                <InputError message={form.errors.selling_price} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-effective-from">
                                Effective From <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="edit-effective-from"
                                    type="date"
                                    value={form.data.effective_from}
                                    onChange={(e) => form.setData('effective_from', e.target.value)}
                                    required
                                    className="pl-9"
                                />
                            </div>
                            <InputError message={form.errors.effective_from} />
                            <p className="text-xs text-muted-foreground">
                                The date when this price becomes effective
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
                            {form.processing ? 'Updating...' : 'Update Price'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

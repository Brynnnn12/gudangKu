import { useForm } from '@inertiajs/react';
import { Calendar, DollarSign, Package, Save } from 'lucide-react';
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
import type { ProductPrice, ProductForSelect } from '@/types/models/product-prices';

interface ProductPriceFormModalProps {
    open: boolean;
    productPrice?: ProductPrice | null;
    products: ProductForSelect[];
    onClose: () => void;
}

export function ProductPriceFormModal({
    open,
    productPrice,
    products,
    onClose
}: ProductPriceFormModalProps) {
    const isEditing = !!productPrice;

    const form = useForm({
        product_id: productPrice?.product_id?.toString() || '',
        cost_price: productPrice ? Math.floor(Number(productPrice.cost_price)).toString() : '',
        selling_price: productPrice ? Math.floor(Number(productPrice.selling_price)).toString() : '',
        effective_from: productPrice?.effective_from || new Date().toISOString().split('T')[0],
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productPrice]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && productPrice) {
            form.put(`/dashboard/product-prices/${productPrice.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            form.post('/dashboard/product-prices', {
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

    const formatCurrency = (value: string) => {
        const number = value.replace(/\D/g, '');
        return new Intl.NumberFormat('id-ID').format(Number(number));
    };

    const handlePriceChange = (field: 'cost_price' | 'selling_price', value: string) => {
        const number = value.replace(/\D/g, '');
        form.setData(field, number);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmit}>
                    <ModalHeader
                        icon={DollarSign}
                        title={isEditing ? 'Edit Harga Produk' : 'Tambah Harga Produk'}
                        description={isEditing ? 'Perbarui informasi harga' : 'Tambahkan harga baru untuk produk'}
                    />
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor={`${isEditing ? 'edit' : 'create'}-product`}>
                                Produk <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.data.product_id}
                                onValueChange={(value) => form.setData('product_id', value)}
                                disabled={isEditing}
                            >
                                <SelectTrigger id={`${isEditing ? 'edit' : 'create'}-product`} disabled={isEditing}>
                                    <SelectValue placeholder="Pilih produk" />
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
                            {isEditing && (
                                <p className="text-xs text-muted-foreground">
                                    Produk tidak dapat diubah saat mengedit harga
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`${isEditing ? 'edit' : 'create'}-cost-price`}>
                                    Harga Modal <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        Rp
                                    </span>
                                    <Input
                                        id={`${isEditing ? 'edit' : 'create'}-cost-price`}
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
                                <Label htmlFor={`${isEditing ? 'edit' : 'create'}-selling-price`}>
                                    Harga Jual <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        Rp
                                    </span>
                                    <Input
                                        id={`${isEditing ? 'edit' : 'create'}-selling-price`}
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
                            <Label htmlFor={`${isEditing ? 'edit' : 'create'}-effective-from`}>
                                Berlaku Mulai <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id={`${isEditing ? 'edit' : 'create'}-effective-from`}
                                    type="date"
                                    value={form.data.effective_from}
                                    onChange={(e) => form.setData('effective_from', e.target.value)}
                                    required
                                    className="pl-9"
                                />
                            </div>
                            <InputError message={form.errors.effective_from} />
                            <p className="text-xs text-muted-foreground">
                                Tanggal mulai berlakunya harga ini
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

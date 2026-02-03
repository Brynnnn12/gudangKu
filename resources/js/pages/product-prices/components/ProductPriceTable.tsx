import { Calendar, DollarSign, Edit, Package, Tag, TrendingUp, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { ProductPrice } from '@/types/models/product-prices';

interface ProductPriceTableProps {
    productPrices: ProductPrice[];
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: number, checked: boolean) => void;
    onEdit: (productPrice: ProductPrice) => void;
    onDelete: (productPrice: ProductPrice) => void;
    allSelected: boolean;
    someSelected: boolean;
}

export function ProductPriceTable({
    productPrices,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onEdit,
    onDelete,
    allSelected,
    someSelected,
}: ProductPriceTableProps) {
    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(value));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const calculateMargin = (costPrice: string, sellingPrice: string) => {
        const cost = Number(costPrice);
        const selling = Number(sellingPrice);
        const margin = ((selling - cost) / cost) * 100;
        return margin.toFixed(1) + '%';
    };

    if (productPrices.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <DollarSign className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada Harga Produk</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Mulai dengan menambahkan harga produk pertama Anda
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12.5">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onSelectAll}
                                aria-label="Pilih semua"
                                className={someSelected ? 'data-[state=checked]:bg-muted-foreground' : ''}
                            />
                        </TableHead>
                        <TableHead className="font-semibold">Produk</TableHead>
                        <TableHead className="font-semibold">SKU</TableHead>
                        <TableHead className="font-semibold">Kategori</TableHead>
                        <TableHead className="text-right font-semibold">Harga Modal</TableHead>
                        <TableHead className="text-right font-semibold">Harga Jual</TableHead>
                        <TableHead className="text-right font-semibold">Margin</TableHead>
                        <TableHead className="font-semibold">Berlaku Mulai</TableHead>
                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productPrices.map((price) => (
                        <TableRow key={price.id} className="group">
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(price.id)}
                                        onCheckedChange={(checked) => onSelectOne(price.id, checked as boolean)}
                                        aria-label={`Pilih ${price.product?.name}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">{price.product?.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {price.product?.brand}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-mono text-sm">{price.product?.sku}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{price.product?.category?.name}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-mono">{formatCurrency(price.cost_price)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                        <span className="font-mono font-medium">
                                            {formatCurrency(price.selling_price)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                        <Badge variant="secondary">
                                            {calculateMargin(price.cost_price, price.selling_price)}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{formatDate(price.effective_from)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5"
                                            onClick={() => onEdit(price)}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => onDelete(price)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Hapus</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}

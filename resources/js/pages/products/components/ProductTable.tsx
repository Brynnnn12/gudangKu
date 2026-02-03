import { Edit, Package, Tag, Trash2 } from 'lucide-react';
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
import type { Product } from '@/types/models/products';

interface ProductTableProps {
    products: Product[];
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: number, checked: boolean) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    allSelected: boolean;
    someSelected: boolean;
}

export function ProductTable({
    products,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onEdit,
    onDelete,
    allSelected,
    someSelected,
}: ProductTableProps) {
    if (products.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada Produk</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Mulai dengan menambahkan produk pertama ke inventaris Anda
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
                        <TableHead className="font-semibold">SKU</TableHead>
                        <TableHead className="font-semibold">Nama Produk</TableHead>
                        <TableHead className="font-semibold">Merek</TableHead>
                        <TableHead className="font-semibold">Kategori</TableHead>
                        <TableHead className="font-semibold">Satuan</TableHead>
                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id} className="group">
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(product.id)}
                                        onCheckedChange={(checked) => onSelectOne(product.id, checked as boolean)}
                                        aria-label={`Pilih ${product.name}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-mono text-xs">
                                        {product.sku}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="text-muted-foreground">{product.brand}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{product.category?.name}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        <span>{product.unit}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5"
                                            onClick={() => onEdit(product)}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => onDelete(product)}
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

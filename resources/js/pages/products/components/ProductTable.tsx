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
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12.5">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onSelectAll}
                                aria-label="Select all"
                                className={someSelected ? 'data-[state=checked]:bg-muted-foreground' : ''}
                            />
                        </TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(product.id)}
                                        onCheckedChange={(checked) => onSelectOne(product.id, checked as boolean)}
                                        aria-label={`Select ${product.name}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-mono text-sm">{product.sku}</span>
                                    </div>
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
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(product)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => onDelete(product)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No products found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

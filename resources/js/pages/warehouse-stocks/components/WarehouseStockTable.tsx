import { Link } from '@inertiajs/react';
import { Edit, Eye, Package, Trash2, Warehouse } from 'lucide-react';
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
import type { WarehouseStock } from '@/types/models/warehouse-stocks';

interface WarehouseStockTableProps {
    warehouseStocks: WarehouseStock[];
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: number, checked: boolean) => void;
    onEdit: (warehouseStock: WarehouseStock) => void;
    onDelete: (warehouseStock: WarehouseStock) => void;
    allSelected: boolean;
    someSelected: boolean;
}

export function WarehouseStockTable({
    warehouseStocks,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onEdit,
    onDelete,
    allSelected,
    someSelected,
}: WarehouseStockTableProps) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onSelectAll}
                                aria-label="Select all"
                                className={
                                    someSelected
                                        ? 'data-[state=checked]:bg-muted-foreground'
                                        : ''
                                }
                            />
                        </TableHead>
                        <TableHead>Warehouse</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {warehouseStocks.length > 0 ? (
                        warehouseStocks.map(warehouseStock => (
                            <TableRow key={warehouseStock.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(warehouseStock.id)}
                                        onCheckedChange={checked =>
                                            onSelectOne(warehouseStock.id, checked as boolean)
                                        }
                                        aria-label={`Select ${warehouseStock.product?.name}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            {warehouseStock.warehouse?.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {warehouseStock.product?.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {warehouseStock.product?.brand}
                                </TableCell>
                                <TableCell>
                                    <span className="font-mono text-sm">
                                        {warehouseStock.product?.sku}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        <span>{warehouseStock.product?.unit}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="secondary" className="font-mono">
                                        {warehouseStock.total_quantity}
                                    </Badge>
                                </TableCell>
                                <TableCell className="space-x-2 text-right">
                                    <Link href={`/dashboard/warehouse-stocks/${warehouseStock.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(warehouseStock)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => onDelete(warehouseStock)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                No warehouse stocks found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

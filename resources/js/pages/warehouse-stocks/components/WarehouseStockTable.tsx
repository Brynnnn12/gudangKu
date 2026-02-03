import { Link } from '@inertiajs/react';
import { Edit, Eye, MinusCircle, Package, PlusCircle, Trash2, Warehouse } from 'lucide-react';
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
    onEdit?: (warehouseStock: WarehouseStock) => void; // Optional - hidden when undefined
    onStockIn: (warehouseStock: WarehouseStock) => void; // Stock in with auto-select
    onStockOut: (warehouseStock: WarehouseStock) => void; // Stock out action
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
    onStockIn,
    onStockOut,
    onDelete,
    allSelected,
    someSelected,
}: WarehouseStockTableProps) {
    if (warehouseStocks.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada Stok</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Mulai dengan menambahkan stok produk pertama ke gudang
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
                        <TableHead className="w-12">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onSelectAll}
                                aria-label="Pilih semua"
                                className={
                                    someSelected
                                        ? 'data-[state=checked]:bg-muted-foreground'
                                        : ''
                                }
                            />
                        </TableHead>
                        <TableHead className="font-semibold">Gudang</TableHead>
                        <TableHead className="font-semibold">Produk</TableHead>
                        <TableHead className="font-semibold">Merek</TableHead>
                        <TableHead className="font-semibold">SKU</TableHead>
                        <TableHead className="font-semibold">Satuan</TableHead>
                        <TableHead className="text-right font-semibold">Kuantitas</TableHead>
                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {warehouseStocks.map(warehouseStock => (
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
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/dashboard/warehouse-stocks/${warehouseStock.id}`}>
                                            <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                                                <Eye className="h-3.5 w-3.5" />
                                                <span className="sr-only sm:not-sr-only">Lihat</span>
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={() => onStockIn(warehouseStock)}
                                            title="Stok Masuk - Auto pilih produk"
                                        >
                                            <PlusCircle className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Masuk</span>
                                        </Button>
                                        {warehouseStock.total_quantity > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                onClick={() => onStockOut(warehouseStock)}
                                                title="Stok Keluar (FEFO)"
                                            >
                                                <MinusCircle className="h-3.5 w-3.5" />
                                                <span className="sr-only sm:not-sr-only">Keluar</span>
                                            </Button>
                                        )}
                                        {onEdit && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-1.5"
                                                onClick={() => onEdit(warehouseStock)}
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                                <span className="sr-only sm:not-sr-only">Edit</span>
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => onDelete(warehouseStock)}
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

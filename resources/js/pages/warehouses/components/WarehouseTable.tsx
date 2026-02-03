import { Edit, MapPin, Trash2, Warehouse as WarehouseIcon } from 'lucide-react';
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
import type { Warehouse } from '@/types/models/warehouses';

interface WarehouseTableProps {
    warehouses: Warehouse[];
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: number, checked: boolean) => void;
    onEdit: (warehouse: Warehouse) => void;
    onDelete: (warehouse: Warehouse) => void;
    allSelected: boolean;
    someSelected: boolean;
}

export function WarehouseTable({
    warehouses,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onEdit,
    onDelete,
    allSelected,
    someSelected,
}: WarehouseTableProps) {
    if (warehouses.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <WarehouseIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada Gudang</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Mulai dengan menambahkan lokasi gudang pertama Anda
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
                        <TableHead className="w-[50px]">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onSelectAll}
                                aria-label="Pilih semua"
                                className={someSelected ? 'data-[state=checked]:bg-muted-foreground' : ''}
                            />
                        </TableHead>
                        <TableHead className="font-semibold">Nama Gudang</TableHead>
                        <TableHead className="font-semibold">Alamat</TableHead>
                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {warehouses.map((warehouse) => (
                        <TableRow key={warehouse.id} className="group">
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(warehouse.id)}
                                        onCheckedChange={(checked) => onSelectOne(warehouse.id, checked as boolean)}
                                        aria-label={`Pilih ${warehouse.name}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{warehouse.name}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    <div className="flex items-start gap-2 max-w-md">
                                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2">{warehouse.address}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5"
                                            onClick={() => onEdit(warehouse)}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => onDelete(warehouse)}
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

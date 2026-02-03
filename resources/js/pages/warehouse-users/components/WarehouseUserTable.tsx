import { Edit, Trash2, UserCircle, Warehouse as WarehouseIcon } from 'lucide-react';
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
import type { WarehouseUser } from '@/types/models/warehouse-users';

interface WarehouseUserTableProps {
    warehouseUsers: WarehouseUser[];
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: number, checked: boolean) => void;
    onEdit: (warehouseUser: WarehouseUser) => void;
    onDelete: (warehouseUser: WarehouseUser) => void;
    allSelected: boolean;
    someSelected: boolean;
}

export function WarehouseUserTable({
    warehouseUsers,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onEdit,
    onDelete,
    allSelected,
    someSelected,
}: WarehouseUserTableProps) {
    if (warehouseUsers.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <UserCircle className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada Penugasan</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Mulai dengan menugaskan pengguna pertama ke gudang
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
                        <TableHead className="font-semibold">Gudang</TableHead>
                        <TableHead className="font-semibold">Pengguna</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {warehouseUsers.map((warehouseUser) => (
                            <TableRow key={warehouseUser.id} className="group">
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(warehouseUser.id)}
                                        onCheckedChange={(checked) => onSelectOne(warehouseUser.id, checked as boolean)}
                                        aria-label={`Pilih ${warehouseUser.warehouse?.name}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{warehouseUser.warehouse?.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                                        <span>{warehouseUser.user?.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {warehouseUser.user?.email}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5"
                                            onClick={() => onEdit(warehouseUser)}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => onDelete(warehouseUser)}
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

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
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onSelectAll}
                                aria-label="Select all"
                                className={someSelected ? 'data-[state=checked]:bg-muted-foreground' : ''}
                            />
                        </TableHead>
                        <TableHead>Warehouse</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {warehouseUsers.length > 0 ? (
                        warehouseUsers.map((warehouseUser) => (
                            <TableRow key={warehouseUser.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(warehouseUser.id)}
                                        onCheckedChange={(checked) => onSelectOne(warehouseUser.id, checked as boolean)}
                                        aria-label={`Select ${warehouseUser.warehouse?.name}`}
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
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(warehouseUser)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => onDelete(warehouseUser)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No warehouse users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

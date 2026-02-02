import { Edit, MapPin, Trash2 } from 'lucide-react';
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
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {warehouses.length > 0 ? (
                        warehouses.map((warehouse) => (
                            <TableRow key={warehouse.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(warehouse.id)}
                                        onCheckedChange={(checked) => onSelectOne(warehouse.id, checked as boolean)}
                                        aria-label={`Select ${warehouse.name}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{warehouse.name}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    <div className="flex items-start gap-2 max-w-md">
                                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2">{warehouse.address}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(warehouse)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => onDelete(warehouse)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No warehouses found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

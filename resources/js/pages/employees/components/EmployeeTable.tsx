import { Edit, Trash2, Users } from 'lucide-react';
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
import type { User as EmployeeUser } from '@/types/models/employee';

interface EmployeeTableProps {
    employees: EmployeeUser[];
    selectedIds: number[];
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: number, checked: boolean) => void;
    onEdit: (employee: EmployeeUser) => void;
    onDelete: (employee: EmployeeUser) => void;
    allSelected: boolean;
    someSelected: boolean;
}

export function EmployeeTable({
    employees,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onEdit,
    onDelete,
    allSelected,
    someSelected,
}: EmployeeTableProps) {
    if (employees.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <Users className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada Karyawan</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Mulai dengan menambahkan karyawan pertama ke sistem Anda
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
                        <TableHead className="font-semibold">Nama</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">No. HP</TableHead>
                        <TableHead className="font-semibold">Peran</TableHead>
                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((employee) => {
                        const roleNames = employee.roles?.map((role) => role.name) ?? [];
                        const roleLabel = roleNames.length > 0 ? roleNames.join(', ') : 'Tanpa peran';
                        const isAdmin = roleNames.some((name) => name.toLowerCase() === 'admin');

                        return (
                            <TableRow key={employee.id} className="group">
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.includes(employee.id)}
                                        onCheckedChange={(checked) => onSelectOne(employee.id, checked as boolean)}
                                        aria-label={`Pilih ${employee.name}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                                <TableCell className="text-muted-foreground font-mono text-sm">
                                    {employee.phone_number || '-'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={isAdmin ? 'default' : 'secondary'}
                                        className="capitalize"
                                    >
                                        {roleLabel}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5"
                                            onClick={() => onEdit(employee)}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => onDelete(employee)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Hapus</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

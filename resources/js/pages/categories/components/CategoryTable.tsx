import { Edit, FolderOpen, Trash2 } from 'lucide-react';
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
import type {  CategoryTableProps } from '@/types/models/categories';


export function CategoryTable({
    categories,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onEdit,
    onDelete,
    allSelected,
    someSelected,
}: CategoryTableProps) {
    if (categories.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <FolderOpen className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada Kategori</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Mulai dengan menambahkan kategori pertama untuk mengatur produk Anda
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-12">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onSelectAll}
                                aria-label="Pilih semua"
                                className={someSelected && !allSelected ? 'data-[state=checked]:bg-muted-foreground' : ''}
                            />
                        </TableHead>
                        <TableHead className="font-semibold">Nama Kategori</TableHead>
                        <TableHead className="font-semibold">Slug URL</TableHead>
                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id} className="group">
                            <TableCell>
                                <Checkbox
                                    checked={selectedIds.includes(category.id)}
                                    onCheckedChange={(checked) => onSelectOne(category.id, checked as boolean)}
                                    aria-label={`Pilih ${category.name}`}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{category.name}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="font-mono text-xs">
                                    {category.slug}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(category)}
                                        className="h-8 gap-1.5"
                                    >
                                        <Edit className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only">Edit</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(category)}
                                        className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
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

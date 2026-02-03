import { Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface EmployeeToolbarProps {
    searchValue: string;
    roleValue: string;
    onSearchChange: (value: string) => void;
    onRoleChange: (value: string) => void;
    onAddClick: () => void;
    onBulkDeleteClick: () => void;
    onClearFilters: () => void;
    selectedCount: number;
    isSearching: boolean;
    hasActiveFilters: boolean;
}

export function EmployeeToolbar({
    searchValue,
    roleValue,
    onSearchChange,
    onRoleChange,
    onAddClick,
    onBulkDeleteClick,
    onClearFilters,
    selectedCount,
    isSearching,
    hasActiveFilters,
}: EmployeeToolbarProps) {
    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Karyawan</h1>
                    {selectedCount > 0 ? (
                        <p className="text-sm text-muted-foreground mt-1">
                            {selectedCount} karyawan dipilih
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola data karyawan Anda
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    {selectedCount > 0 && (
                        <Button
                            variant="destructive"
                            onClick={onBulkDeleteClick}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    )}
                    <Button onClick={onAddClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Karyawan
                    </Button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari berdasarkan nama atau email"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                        disabled={isSearching}
                    />
                </div>
                <Select
                    value={roleValue || 'all'}
                    onValueChange={onRoleChange}
                    disabled={isSearching}
                >
                    <SelectTrigger className="w-full sm:w-45">
                        <SelectValue placeholder="Filter berdasarkan peran" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Peran</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex gap-2">
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onClearFilters}
                            disabled={isSearching}
                            title="Hapus filter"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}

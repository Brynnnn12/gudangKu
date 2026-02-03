import { Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WarehouseUserToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
    onBulkDeleteClick: () => void;
    onClearFilters: () => void;
    selectedCount: number;
    isSearching: boolean;
    hasActiveFilters: boolean;
}

export function WarehouseUserToolbar({
    searchValue,
    onSearchChange,
    onAddClick,
    onBulkDeleteClick,
    onClearFilters,
    selectedCount,
    isSearching,
    hasActiveFilters,
}: WarehouseUserToolbarProps) {
    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Pengguna Gudang</h1>
                    {selectedCount > 0 ? (
                        <p className="text-sm text-muted-foreground mt-1">
                            {selectedCount} penugasan dipilih
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola penugasan pengguna ke gudang
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
                        Tambah Penugasan
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari berdasarkan gudang atau nama pengguna"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                        disabled={isSearching}
                    />
                </div>
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

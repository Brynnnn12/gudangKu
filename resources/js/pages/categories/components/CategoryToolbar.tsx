import { Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type {  CategoryToolbarProps } from '@/types/models/categories';



export function CategoryToolbar({
    searchValue,
    onSearchChange,
    onAddClick,
    onBulkDeleteClick,
    onClearFilters,
    selectedCount,
    isSearching,
    hasActiveFilters,
}: CategoryToolbarProps) {
    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kategori</h1>
                    {selectedCount > 0 ? (
                        <p className="text-sm text-muted-foreground mt-1">
                            {selectedCount} kategori dipilih
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola kategori produk Anda
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    {selectedCount > 0 && (
                        <Button
                            variant="destructive"
                            onClick={onBulkDeleteClick}
                            className="gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Hapus ({selectedCount})
                        </Button>
                    )}
                    <Button onClick={onAddClick} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari berdasarkan nama atau slug..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 h-10"
                        disabled={isSearching}
                    />
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onClearFilters}
                        disabled={isSearching}
                        title="Hapus filter"
                        className="h-10 w-10"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </>
    );
}

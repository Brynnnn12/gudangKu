import { Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProductToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
    onBulkDeleteClick: () => void;
    onClearFilters: () => void;
    selectedCount: number;
    isSearching: boolean;
    hasActiveFilters: boolean;
}

export function ProductToolbar({
    searchValue,
    onSearchChange,
    onAddClick,
    onBulkDeleteClick,
    onClearFilters,
    selectedCount,
    isSearching,
    hasActiveFilters,
}: ProductToolbarProps) {
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Products</h1>
                    {selectedCount > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
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
                            Delete Selected ({selectedCount})
                        </Button>
                    )}
                    <Button onClick={onAddClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, brand, SKU, or category..."
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
                            title="Clear filters"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}

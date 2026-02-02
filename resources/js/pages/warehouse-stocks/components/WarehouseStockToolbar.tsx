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
import type { Product } from '@/types/models/products';
import type { Warehouse } from '@/types/models/warehouses';

interface WarehouseStockToolbarProps {
    searchValue: string;
    warehouseId: string | number;
    productId: string | number;
    warehouses: Warehouse[];
    products: Product[];
    onSearchChange: (value: string) => void;
    onWarehouseChange: (value: string) => void;
    onProductChange: (value: string) => void;
    onAddClick?: () => void; // Optional - hidden when undefined
    onBulkDeleteClick: () => void;
    onClearFilters: () => void;
    selectedCount: number;
    isSearching: boolean;
    hasActiveFilters: boolean;
}

export function WarehouseStockToolbar({
    searchValue,
    warehouseId,
    productId,
    warehouses,
    products,
    onSearchChange,
    onWarehouseChange,
    onProductChange,
    onAddClick,
    onBulkDeleteClick,
    onClearFilters,
    selectedCount,
    isSearching,
    hasActiveFilters,
}: WarehouseStockToolbarProps) {
    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Warehouse Stocks</h1>
                    {selectedCount > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    {selectedCount > 0 && (
                        <Button variant="destructive" onClick={onBulkDeleteClick}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Selected ({selectedCount})
                        </Button>
                    )}
                    {onAddClick && (
                        <Button onClick={onAddClick}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Stock
                        </Button>
                    )}
                </div>
            </div>

            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search warehouse or product..."
                        value={searchValue}
                        onChange={e => onSearchChange(e.target.value)}
                        className="pl-9"
                        disabled={isSearching}
                    />
                </div>
                <div className="flex gap-2">
                    <Select
                        value={warehouseId ? String(warehouseId) : undefined}
                        onValueChange={onWarehouseChange}
                    >
                        <SelectTrigger className="w-full sm:w-50">
                            <SelectValue placeholder="All Warehouses" />
                        </SelectTrigger>
                        <SelectContent>
                            {warehouses.map(warehouse => (
                                <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                                    {warehouse.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={productId ? String(productId) : undefined}
                        onValueChange={onProductChange}
                    >
                        <SelectTrigger className="w-full sm:w-50">
                            <SelectValue placeholder="All Products" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map(product => (
                                <SelectItem key={product.id} value={String(product.id)}>
                                    {product.name} - {product.brand}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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

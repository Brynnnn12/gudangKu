import { Filter, Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { ProductForSelect } from '@/types/models/product-prices';

interface ProductPriceToolbarProps {
    searchValue: string;
    productIdValue: string | number;
    products: ProductForSelect[];
    onSearchChange: (value: string) => void;
    onProductIdChange: (value: string) => void;
    onAddClick: () => void;
    onBulkDeleteClick: () => void;
    onClearFilters: () => void;
    selectedCount: number;
    isSearching: boolean;
    hasActiveFilters: boolean;
}

export function ProductPriceToolbar({
    searchValue,
    productIdValue,
    products,
    onSearchChange,
    onProductIdChange,
    onAddClick,
    onBulkDeleteClick,
    onClearFilters,
    selectedCount,
    isSearching,
    hasActiveFilters,
}: ProductPriceToolbarProps) {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Harga Produk</h1>
                    {selectedCount > 0 ? (
                        <p className="text-sm text-muted-foreground mt-1">
                            {selectedCount} harga dipilih
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola harga produk Anda
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
                        Tambah Harga
                    </Button>
                </div>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari berdasarkan nama produk, SKU, atau merek"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                        disabled={isSearching}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="w-[200px]">
                        <Select
                            value={productIdValue?.toString()}
                            onValueChange={(value) => onProductIdChange(value)}
                        >
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    <SelectValue placeholder="Semua Produk" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id.toString()}>
                                        {product.sku} - {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
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

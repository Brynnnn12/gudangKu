import { Plus, Search, X } from 'lucide-react';
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
import type { StockTransferStatus } from '@/types/models/stock-transfers';
import type { Warehouse } from '@/types/models/warehouses';

interface StockTransferToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
    onClearFilters: () => void;
    isSearching: boolean;
    hasActiveFilters: boolean;
    warehouses: Warehouse[];
    products: Product[];
    filters: {
        from_warehouse_id?: string;
        to_warehouse_id?: string;
        product_id?: string;
        status?: StockTransferStatus;
    };
    onFilterChange: (key: string, value: string | undefined) => void;
}

export function StockTransferToolbar({
    searchValue,
    onSearchChange,
    onAddClick,
    onClearFilters,
    isSearching,
    hasActiveFilters,
    warehouses,
    products,
    filters,
    onFilterChange,
}: StockTransferToolbarProps) {

    // Helper untuk menangani perubahan filter agar tetap konsisten dengan backend
    const handleSelectChange = (key: string, value: string) => {
        onFilterChange(key, value === "all" ? undefined : value);
    };

    return (
        <>
            {/* Header tetap sama */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Transfer Stok</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Kelola transfer stok antar gudang
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onAddClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        Transfer Baru
                    </Button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="mb-4 flex flex-col gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari berdasarkan gudang, produk, atau catatan..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                        disabled={isSearching}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Filter: From Warehouse */}
                    <Select
                        value={filters.from_warehouse_id || "all"}
                        onValueChange={(val) => handleSelectChange('from_warehouse_id', val)}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Dari Gudang" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Gudang</SelectItem>
                            {warehouses.map((w) => (
                                <SelectItem key={w.id} value={w.id.toString()}>
                                    {w.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Filter: To Warehouse */}
                    <Select
                        value={filters.to_warehouse_id || "all"}
                        onValueChange={(val) => handleSelectChange('to_warehouse_id', val)}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Ke Gudang" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Gudang</SelectItem>
                            {warehouses.map((w) => (
                                <SelectItem key={w.id} value={w.id.toString()}>
                                    {w.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Filter: Product */}
                    <Select
                        value={filters.product_id || "all"}
                        onValueChange={(val) => handleSelectChange('product_id', val)}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Produk" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Produk</SelectItem>
                            {products.map((p) => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.sku} - {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Filter: Status */}
                    <Select
                        value={filters.status || "all"}
                        onValueChange={(val) => handleSelectChange('status', val)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">Menunggu</SelectItem>
                            <SelectItem value="completed">Selesai</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>

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

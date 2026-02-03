import { Link } from '@inertiajs/react';
import { Info, Package, Warehouse } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { WarehouseStock } from '@/types/models/warehouse-stocks';

interface WarehouseStockDetailModalProps {
    open: boolean;
    warehouseStock: WarehouseStock | null;
    onClose: () => void;
}

export function WarehouseStockDetailModal({
    open,
    warehouseStock,
    onClose,
}: WarehouseStockDetailModalProps) {
    console.log('Modal render:', { open, hasWarehouseStock: !!warehouseStock, warehouseStock });

    return (
        <Dialog open={open && !!warehouseStock} onOpenChange={(isOpen) => !isOpen && onClose()}>
            {warehouseStock && (
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Stok Gudang #{warehouseStock.id}</DialogTitle>
                    </DialogHeader>

                <div className="space-y-4">
                    {/* Info Banner */}
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Total Otomatis</AlertTitle>
                        <AlertDescription>
                            Total kuantitas di bawah dihitung otomatis dari semua batch stok. Untuk
                            melihat atau mengelola batch individu (FEFO), klik tombol "Lihat Batch"
                            di bawah.
                        </AlertDescription>
                    </Alert>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Warehouse className="h-4 w-4" />
                                    Informasi Gudang
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nama Gudang</p>
                                    <p className="font-medium">{warehouseStock.warehouse?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Alamat</p>
                                    <p className="font-medium">
                                        {warehouseStock.warehouse?.address}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Package className="h-4 w-4" />
                                    Informasi Produk
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nama Produk</p>
                                    <p className="font-medium">{warehouseStock.product?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Brand</p>
                                    <p className="font-medium">{warehouseStock.product?.brand}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">SKU</p>
                                    <p className="font-medium">{warehouseStock.product?.sku}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Unit</p>
                                    <p className="font-medium">{warehouseStock.product?.unit}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-base">Informasi Stok</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Total Kuantitas
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {warehouseStock.total_quantity}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Dibuat Pada</p>
                                        <p className="font-medium">
                                            {new Date(warehouseStock.created_at).toLocaleString(
                                                'id-ID'
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Terakhir Diperbarui
                                        </p>
                                        <p className="font-medium">
                                            {new Date(warehouseStock.updated_at).toLocaleString(
                                                'id-ID'
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Link
                            href={`/dashboard/stock-logs?warehouse_id=${warehouseStock.warehouse_id}&product_id=${warehouseStock.product_id}`}
                        >
                            <Button variant="outline" onClick={onClose}>
                                <Package className="mr-2 h-4 w-4" />
                                Lihat Batch
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={onClose}>
                            Tutup
                        </Button>
                    </div>
                </div>
            </DialogContent>
            )}
        </Dialog>
    );
}

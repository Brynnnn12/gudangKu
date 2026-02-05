import { Warehouse, Package, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StockByWarehouseChartProps {
    data: Array<{
        name: string;
        items: number;
        quantity: number;
    }>;
}

export function StockByWarehouseChart({ data }: StockByWarehouseChartProps) {
    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    const maxQuantity = Math.max(...data.map((item) => item.quantity));

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-blue-600" />
                    <CardTitle>Stok Tersedia di Semua Gudang</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                        <Package className="mb-2 h-12 w-12 opacity-50" />
                        <p>Tidak ada data stok gudang</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.map((warehouse, index) => {
                            const percentage = (warehouse.quantity / maxQuantity) * 100;
                            const colors = [
                                'bg-blue-500',
                                'bg-green-500',
                                'bg-purple-500',
                                'bg-amber-500',
                                'bg-pink-500',
                                'bg-cyan-500',
                            ];
                            const color = colors[index % colors.length];

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 font-medium">
                                            <Warehouse className="h-4 w-4 text-muted-foreground" />
                                            <span>{warehouse.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Package className="h-3 w-3" />
                                                <span>{formatNumber(warehouse.items)} produk</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Layers className="h-3 w-3" />
                                                <span className="font-semibold text-foreground">
                                                    {formatNumber(warehouse.quantity)} unit
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div
                                            className={`h-full rounded-full ${color} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

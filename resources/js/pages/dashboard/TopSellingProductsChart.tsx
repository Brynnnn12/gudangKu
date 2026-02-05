import { TrendingUp, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TopSellingProductsChartProps {
    data: Array<{
        name: string;
        sku: string;
        total: number;
    }>;
}

export function TopSellingProductsChart({ data }: TopSellingProductsChartProps) {
    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    const maxTotal = Math.max(...data.map((item) => item.total), 1);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <CardTitle>Top 10 Produk Terlaris</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">Berdasarkan penjualan 30 hari terakhir</p>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                        <Package className="mb-2 h-12 w-12 opacity-50" />
                        <p>Tidak ada data penjualan</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.map((product, index) => {
                            const percentage = (product.total / maxTotal) * 100;
                            const colors = [
                                'bg-gradient-to-r from-yellow-400 to-yellow-600',
                                'bg-gradient-to-r from-gray-300 to-gray-500',
                                'bg-gradient-to-r from-amber-600 to-amber-800',
                                'bg-gradient-to-r from-green-500 to-green-600',
                                'bg-gradient-to-r from-blue-500 to-blue-600',
                                'bg-gradient-to-r from-purple-500 to-purple-600',
                                'bg-gradient-to-r from-pink-500 to-pink-600',
                                'bg-gradient-to-r from-indigo-500 to-indigo-600',
                                'bg-gradient-to-r from-teal-500 to-teal-600',
                                'bg-gradient-to-r from-orange-500 to-orange-600',
                            ];
                            const color = colors[index];

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-2">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-xs font-bold text-white shadow-sm">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium leading-tight">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    SKU: {product.sku}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold">
                                                {formatNumber(product.total)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">unit</div>
                                        </div>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div
                                            className={`h-full rounded-full ${color} shadow-sm transition-all duration-500`}
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

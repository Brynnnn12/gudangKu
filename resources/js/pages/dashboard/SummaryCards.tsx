import { TrendingUp, TrendingDown, Package, DollarSign, AlertTriangle, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardsProps {
    totalRevenue: number;
    totalCosts: number;
    profit: number;
    profitMargin: number;
    totalValue: number;
    nearExpiryCount: number;
}

export function SummaryCards({
    totalRevenue,
    totalCosts,
    profit,
    profitMargin,
    totalValue,
    nearExpiryCount
}: SummaryCardsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pemasukan (7 Hari)</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">Total pendapatan dari penjualan</p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pengeluaran (7 Hari)</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(totalCosts)}</div>
                    <p className="text-xs text-muted-foreground">Total biaya pembelian stok</p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profit (7 Hari)</CardTitle>
                    <Percent className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(profit)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Margin: {profitMargin.toFixed(1)}%
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nilai Inventory</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
                    <p className="text-xs text-muted-foreground">Total nilai stok saat ini</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Peringatan Expired</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{nearExpiryCount}</div>
                    <p className="text-xs text-muted-foreground">Batch akan expired {'<'} 3 bulan</p>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status Finansial</CardTitle>
                    <DollarSign className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${
                        profit > 0 ? 'text-green-600' : profit < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                        {profit > 0 ? 'Untung' : profit < 0 ? 'Rugi' : 'Break Even'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Performa bisnis 7 hari terakhir
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

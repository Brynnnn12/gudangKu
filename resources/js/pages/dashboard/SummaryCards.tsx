import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    ArrowUpCircle,
    ArrowDownCircle,
    DollarSign,
    Percent,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardsProps {
    financial: {
        revenue: number;
        costs: number;
        profit: number;
        profitMargin: number;
    };
    nearExpiry: {
        count: number;
    };
    stockMovement: {
        stockIn: number;
        stockOut: number;
    };
}

export function SummaryCards({ financial, nearExpiry, stockMovement }: SummaryCardsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Financial Card */}
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ringkasan Finansial</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div>
                            <div className="text-xs text-muted-foreground">Total Pendapatan</div>
                            <div className="text-xl font-bold text-green-600">
                                {formatCurrency(financial.revenue)}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">Total Biaya</div>
                            <div className="text-xl font-bold text-red-600">
                                {formatCurrency(financial.costs)}
                            </div>
                        </div>
                        <div className="border-t pt-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-muted-foreground">Profit</div>
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(financial.profit)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-muted-foreground">Margin</div>
                                    <div
                                        className={`flex items-center gap-1 text-lg font-bold ${
                                            financial.profitMargin >= 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {financial.profitMargin >= 0 ? (
                                            <TrendingUp className="h-4 w-4" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4" />
                                        )}
                                        {financial.profitMargin.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Near Expiry Card */}
            <Card className="border-l-4 border-l-amber-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stok Mendekati Expired</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="text-4xl font-bold">{formatNumber(nearExpiry.count)}</div>
                        <p className="text-xs text-muted-foreground">
                            Batch yang akan/telah expired dalam 30 hari
                        </p>
                        {nearExpiry.count > 0 && (
                            <div className="mt-4 rounded-md bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                                ⚠️ Periksa peringatan FEFO di bawah untuk detail lengkap
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Stock Movement Card */}
            <Card className="border-l-4 border-l-purple-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pergerakan Stok</CardTitle>
                    <Percent className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ArrowUpCircle className="h-5 w-5 text-green-500" />
                                <div>
                                    <div className="text-xs text-muted-foreground">Stok Masuk</div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {formatNumber(stockMovement.stockIn)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ArrowDownCircle className="h-5 w-5 text-red-500" />
                                <div>
                                    <div className="text-xs text-muted-foreground">Stok Keluar</div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {formatNumber(stockMovement.stockOut)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t pt-2">
                            <div className="text-xs text-muted-foreground">
                                Pergerakan dalam 30 hari terakhir
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

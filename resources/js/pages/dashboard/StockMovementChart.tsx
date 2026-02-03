import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StockMovementChartProps {
    data: Array<{
        date: string;
        stock_in: number;
        stock_out: number;
    }>;
}

export function StockMovementChart({ data }: StockMovementChartProps) {
    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mutasi Barang</CardTitle>
                <CardDescription>Tren barang masuk vs keluar (7 hari terakhir)</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="stock_in"
                            stroke="hsl(var(--chart-1))"
                            strokeWidth={2}
                            name="Barang Masuk"
                            dot={{ r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="stock_out"
                            stroke="hsl(var(--chart-2))"
                            strokeWidth={2}
                            name="Barang Keluar"
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';

interface RevenueVsCostChartProps {
    data: Array<{
        date: string;
        revenue: number;
        costs: number;
        profit: number;
    }>;}

export function RevenueVsCostChart({ data }: RevenueVsCostChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pemasukan vs Pengeluaran</CardTitle>
                <CardDescription>Analisis finansial 7 hari terakhir</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `Rp ${(value / 1000)}k`} />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc' }}
                        />
                        <Legend />
                        <Bar
                            dataKey="revenue"
                            fill="hsl(142, 76%, 36%)"
                            name="Pemasukan"
                            radius={[8, 8, 0, 0]}
                        />
                        <Bar
                            dataKey="costs"
                            fill="hsl(0, 84%, 60%)"
                            name="Pengeluaran"
                            radius={[8, 8, 0, 0]}
                        />
                        <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="hsl(217, 91%, 60%)"
                            strokeWidth={3}
                            name="Profit"
                            dot={{ r: 4, fill: 'hsl(217, 91%, 60%)' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

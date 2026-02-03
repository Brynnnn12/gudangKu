import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StockByCategoryChartProps {
    data: Array<{
        name: string;
        total: number;
    }>;
}

export function StockByCategoryChart({ data }: StockByCategoryChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Stok per Kategori</CardTitle>
                <CardDescription>Top 10 kategori dengan stok terbanyak</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            fontSize={12}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

import { Link } from '@inertiajs/react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RecentActivity {
    id: number;
    warehouse: string;
    product: string;
    sku: string;
    qty: number;
    type: string;
    user: string;
    notes: string | null;
    created_at: string;
}

interface RecentActivitiesProps {
    data: RecentActivity[];
}

export function RecentActivities({ data }: RecentActivitiesProps) {
    const getTypeBadge = (type: string, qty: number) => {
        if (qty > 0) {
            return <Badge variant="default" className="gap-1">
                <ArrowUpRight className="h-3 w-3" />
                Masuk
            </Badge>;
        } else {
            return <Badge variant="destructive" className="gap-1">
                <ArrowDownRight className="h-3 w-3" />
                Keluar
            </Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Aktivitas Terbaru</CardTitle>
                        <CardDescription>10 transaksi stok terakhir</CardDescription>
                    </div>
                    <Link
                        href="/dashboard/recent-activities"
                        className="text-sm text-primary hover:underline"
                    >
                        Lihat Semua
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Gudang</TableHead>
                            <TableHead>Produk</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Waktu</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    Belum ada aktivitas
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell className="font-medium">{activity.warehouse}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{activity.product}</span>
                                            <span className="text-xs text-muted-foreground">{activity.sku}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {activity.qty > 0 ? '+' : ''}{activity.qty}
                                    </TableCell>
                                    <TableCell>{getTypeBadge(activity.type, activity.qty)}</TableCell>
                                    <TableCell className="text-sm">{activity.user}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {activity.created_at}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

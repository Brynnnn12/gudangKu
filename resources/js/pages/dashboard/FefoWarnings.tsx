import { Link } from '@inertiajs/react';
import { AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FefoWarning {
    id: number;
    batch_number: string;
    warehouse: string;
    product: string;
    sku: string;
    qty: number;
    expired_at: string;
    status: string;
    days_until_expiry: number | null;
}

interface FefoWarningsProps {
    data: FefoWarning[];
}

export function FefoWarnings({ data }: FefoWarningsProps) {
    const getStatusBadge = (status: string, daysUntilExpiry: number | null) => {
        if (status === 'expired') {
            return <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                Expired
            </Badge>;
        } else {
            return <Badge variant="secondary" className="gap-1 bg-yellow-500/10 text-yellow-600">
                <AlertTriangle className="h-3 w-3" />
                {daysUntilExpiry !== null ? `${Math.floor(daysUntilExpiry)} hari` : 'Warning'}
            </Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            Peringatan Batch Expired (FEFO)
                        </CardTitle>
                        <CardDescription>Batch yang akan/sudah expired</CardDescription>
                    </div>
                    <Link
                        href="/dashboard/stock-logs"
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
                            <TableHead>Batch Number</TableHead>
                            <TableHead>Gudang</TableHead>
                            <TableHead>Produk</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead>Tanggal Expired</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    Tidak ada batch yang akan expired
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((warning) => (
                                <TableRow key={warning.id}>
                                    <TableCell className="font-mono text-sm">
                                        {warning.batch_number}
                                    </TableCell>
                                    <TableCell className="font-medium">{warning.warehouse}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{warning.product}</span>
                                            <span className="text-xs text-muted-foreground">{warning.sku}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{warning.qty}</TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(warning.expired_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(warning.status, warning.days_until_expiry)}
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

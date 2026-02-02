import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Package, Warehouse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { WarehouseStock } from '@/types/models/warehouse-stocks';

export default function Show({ warehouseStock }: { warehouseStock: WarehouseStock }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Warehouse Stocks', href: '/dashboard/warehouse-stocks' },
        { title: 'Detail', href: `/dashboard/warehouse-stocks/${warehouseStock.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Warehouse Stock #${warehouseStock.id}`} />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Warehouse Stock Details</h1>
                    <Link href="/dashboard/warehouse-stocks">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to List
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Warehouse className="h-5 w-5" />
                                Warehouse Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Warehouse Name</p>
                                <p className="font-medium">{warehouseStock.warehouse?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Address</p>
                                <p className="font-medium">{warehouseStock.warehouse?.address}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Product Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Product Name</p>
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
                            <CardTitle>Stock Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Quantity</p>
                                    <p className="text-2xl font-bold">{warehouseStock.total_quantity}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Created At</p>
                                    <p className="font-medium">
                                        {new Date(warehouseStock.created_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Updated</p>
                                    <p className="font-medium">
                                        {new Date(warehouseStock.updated_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

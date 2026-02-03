import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { StockTransferFormPageProps, StockTransferFormData } from '@/types/models/stock-transfers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

export default function Edit({ stockTransfer, warehouses, products }: StockTransferFormPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Stock Transfers', href: '/dashboard/stock-transfers' },
        { title: `Edit #${stockTransfer?.id}`, href: `/dashboard/stock-transfers/${stockTransfer?.id}/edit` },
    ];

    const form = useForm<StockTransferFormData>({
        from_warehouse_id: stockTransfer?.from_warehouse_id.toString() || '',
        to_warehouse_id: stockTransfer?.to_warehouse_id.toString() || '',
        product_id: stockTransfer?.product_id.toString() || '',
        qty: stockTransfer?.qty.toString() || '',
        notes: stockTransfer?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/dashboard/stock-transfers/${stockTransfer?.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Stock Transfer #${stockTransfer?.id}`} />
            <div className="p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/dashboard/stock-transfers/${stockTransfer?.id}`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold">Edit Stock Transfer #{stockTransfer?.id}</h1>
                            <p className="text-sm text-muted-foreground">
                                Update the transfer request details
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Transfer Details</CardTitle>
                                <CardDescription>
                                    Modify the stock transfer request (only pending transfers can be edited)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="from_warehouse_id">
                                            From Warehouse <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={form.data.from_warehouse_id.toString()}
                                            onValueChange={(value) => form.setData('from_warehouse_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select source warehouse" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {warehouses.map((warehouse) => (
                                                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                        {warehouse.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={form.errors.from_warehouse_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="to_warehouse_id">
                                            To Warehouse <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={form.data.to_warehouse_id.toString()}
                                            onValueChange={(value) => form.setData('to_warehouse_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select destination warehouse" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {warehouses.map((warehouse) => (
                                                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                        {warehouse.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={form.errors.to_warehouse_id} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="product_id">
                                        Product <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.product_id.toString()}
                                        onValueChange={(value) => form.setData('product_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((product) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.sku} - {product.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.product_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="qty">
                                        Quantity <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="qty"
                                        type="number"
                                        min="1"
                                        value={form.data.qty}
                                        onChange={(e) => form.setData('qty', e.target.value)}
                                        placeholder="Enter quantity to transfer"
                                    />
                                    <InputError message={form.errors.qty} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        placeholder="Additional notes or reasons for the transfer..."
                                        rows={4}
                                    />
                                    <InputError message={form.errors.notes} />
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={`/dashboard/stock-transfers/${stockTransfer?.id}`}>Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={form.processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {form.processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stock Transfers', href: '/dashboard/stock-transfers' },
    { title: 'Create', href: '/dashboard/stock-transfers/create' },
];

export default function Create({ warehouses, products }: StockTransferFormPageProps) {
    const form = useForm<StockTransferFormData>({
        from_warehouse_id: '',
        to_warehouse_id: '',
        product_id: '',
        qty: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/dashboard/stock-transfers');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Stock Transfer" />
            <div className="p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/dashboard/stock-transfers">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold">Create Stock Transfer</h1>
                            <p className="text-sm text-muted-foreground">
                                Request a new inter-warehouse stock transfer
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Transfer Details</CardTitle>
                                <CardDescription>
                                    Fill in the details for the stock transfer request
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
                                        <Link href="/dashboard/stock-transfers">Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={form.processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {form.processing ? 'Creating...' : 'Create Transfer'}
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

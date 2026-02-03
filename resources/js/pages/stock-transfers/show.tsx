import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle, User, Calendar } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { StockTransferShowPageProps } from '@/types/models/stock-transfers';

export default function Show({
    stockTransfer,
    canUpdate,
    canDelete,
    canApprove,
    canReject,
}: StockTransferShowPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Stock Transfers', href: '/dashboard/stock-transfers' },
        { title: `Transfer #${stockTransfer.id}`, href: `/dashboard/stock-transfers/${stockTransfer.id}` },
    ];

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'completed':
                return <Badge variant="default">Completed</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleApprove = () => {
        router.post(`/dashboard/stock-transfers/${stockTransfer.id}/approve`, {}, {
            preserveScroll: true,
            onError: (errors) => toast.error(errors.error || 'Failed to approve transfer'),
        });
    };

    const handleReject = () => {
        router.post(`/dashboard/stock-transfers/${stockTransfer.id}/reject`, {
            reject_reason: rejectReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectDialogOpen(false);
                setRejectReason('');
            },
            onError: (errors) => toast.error(errors.error || 'Failed to reject transfer'),
        });
    };

    const handleDelete = () => {
        router.delete(`/dashboard/stock-transfers/${stockTransfer.id}`, {
            onSuccess: () => router.visit('/dashboard/stock-transfers'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Stock Transfer #${stockTransfer.id}`} />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" asChild>
                                <Link href="/dashboard/stock-transfers">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-2xl font-semibold">Stock Transfer #{stockTransfer.id}</h1>
                                <p className="text-sm text-muted-foreground">
                                    View transfer request details
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {canApprove && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="default">
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Approve
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Approve Transfer?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will execute the stock transfer using FEFO logic. Stock will be deducted from source warehouse and added to destination warehouse.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleApprove}>
                                                Approve Transfer
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                            {canReject && (
                                <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive">
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Reject
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Reject Transfer</DialogTitle>
                                            <DialogDescription>
                                                Provide a reason for rejecting this transfer request.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-2">
                                            <Label htmlFor="reject_reason">Reason (Optional)</Label>
                                            <Textarea
                                                id="reject_reason"
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="Enter rejection reason..."
                                                rows={4}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button variant="destructive" onClick={handleReject}>
                                                Reject Transfer
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                            {canUpdate && (
                                <Button variant="outline" asChild>
                                    <Link href={`/dashboard/stock-transfers/${stockTransfer.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                            )}
                            {canDelete && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Transfer?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Transfer Information</CardTitle>
                                    {getStatusBadge(stockTransfer.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">From Warehouse</Label>
                                        <p className="font-medium">{stockTransfer.from_warehouse.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">To Warehouse</Label>
                                        <p className="font-medium">{stockTransfer.to_warehouse.name}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="text-muted-foreground">Product</Label>
                                    <p className="font-medium">{stockTransfer.product.name}</p>
                                    <p className="text-sm text-muted-foreground">{stockTransfer.product.sku}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Quantity</Label>
                                    <p className="font-medium">{stockTransfer.qty} units</p>
                                </div>
                                {stockTransfer.notes && (
                                    <>
                                        <Separator />
                                        <div>
                                            <Label className="text-muted-foreground">Notes</Label>
                                            <p className="text-sm whitespace-pre-wrap">{stockTransfer.notes}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <Label className="text-muted-foreground">Requested By</Label>
                                        <p className="text-sm">{stockTransfer.user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <Label className="text-muted-foreground">Created At</Label>
                                        <p className="text-sm">
                                            {new Date(stockTransfer.created_at).toLocaleString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <Label className="text-muted-foreground">Last Updated</Label>
                                        <p className="text-sm">
                                            {new Date(stockTransfer.updated_at).toLocaleString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

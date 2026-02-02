import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CreateProductPriceModal from '@/pages/product-prices/create';
import EditProductPriceModal from '@/pages/product-prices/edit';
import type { ProductPrice, ProductForSelect } from '@/types/models/product-prices';

interface ModalState {
    create: boolean;
    edit: { isOpen: boolean; productPrice: ProductPrice | null };
    delete: { isOpen: boolean; productPrice: ProductPrice | null };
    bulkDelete: boolean;
}

interface ProductPriceModalsProps {
    modals: ModalState;
    products: ProductForSelect[];
    onCloseModal: (type: keyof ModalState) => void;
    onConfirmDelete: () => void;
    onConfirmBulkDelete: () => void;
    selectedCount: number;
}

export function ProductPriceModals({
    modals,
    products,
    onCloseModal,
    onConfirmDelete,
    onConfirmBulkDelete,
    selectedCount,
}: ProductPriceModalsProps) {
    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(value));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <CreateProductPriceModal
                open={modals.create}
                products={products}
                onClose={() => onCloseModal('create')}
            />

            {modals.edit.isOpen && modals.edit.productPrice && (
                <EditProductPriceModal
                    open={modals.edit.isOpen}
                    productPrice={modals.edit.productPrice}
                    products={products}
                    onClose={() => onCloseModal('edit')}
                />
            )}

            <AlertDialog open={modals.bulkDelete} onOpenChange={() => onCloseModal('bulkDelete')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Multiple Prices</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedCount} price{selectedCount > 1 ? 's' : ''}?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onConfirmBulkDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete {selectedCount} Item{selectedCount > 1 ? 's' : ''}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={modals.delete.isOpen} onOpenChange={() => onCloseModal('delete')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {modals.delete.productPrice && (
                                <div className="space-y-2 mt-2">
                                    <p>
                                        This will delete the price for "{modals.delete.productPrice.product?.name}" effective from{' '}
                                        {formatDate(modals.delete.productPrice.effective_from)}:
                                    </p>
                                    <div className="rounded-md bg-muted p-3 space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Cost Price:</span>
                                            <span className="font-medium">{formatCurrency(modals.delete.productPrice.cost_price)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Selling Price:</span>
                                            <span className="font-medium">{formatCurrency(modals.delete.productPrice.selling_price)}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm">This action cannot be undone.</p>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

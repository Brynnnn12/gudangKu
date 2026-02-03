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
import type { ModalState as GenericModalState, ModalWithData } from '@/hooks/useGenericModals';
import { ProductPriceFormModal } from '@/pages/product-prices/components/ProductPriceFormModal';
import type { ProductPrice, ProductForSelect } from '@/types/models/product-prices';

const DeleteConfirmDialog = ({
    open,
    title,
    description,
    onConfirm,
    onClose,
    children,
}: {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onClose: () => void;
    children?: React.ReactNode;
}) => (
    <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription asChild>
                    <div>{description}{children}</div>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                    onClick={onConfirm}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                    Hapus
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);


interface ProductPriceModalsProps {
    modals: GenericModalState<ProductPrice>;
    products: ProductForSelect[];
    onCloseModal: (type: string) => void;
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
            <ProductPriceFormModal
                open={(modals.edit as ModalWithData<ProductPrice>).isOpen}
                productPrice={(modals.edit as ModalWithData<ProductPrice>).data}
                products={products}
                onClose={() => onCloseModal('edit')}
            />

            <DeleteConfirmDialog
                open={modals.bulkDelete as boolean}
                title="Hapus Beberapa Harga"
                description={`Apakah Anda yakin ingin menghapus ${selectedCount} harga produk? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmBulkDelete}
                onClose={() => onCloseModal('bulkDelete')}
            />

            <DeleteConfirmDialog
                open={(modals.delete as ModalWithData<ProductPrice>).isOpen}
                title="Hapus Harga Produk"
                description=""
                onConfirm={onConfirmDelete}
                onClose={() => onCloseModal('delete')}
            >
                {(modals.delete as ModalWithData<ProductPrice>).data && (
                    <div className="space-y-2 mt-2">
                        <p>
                            Hapus harga untuk "{(modals.delete as ModalWithData<ProductPrice>).data?.product?.name}" berlaku mulai{' '}
                            {formatDate((modals.delete as ModalWithData<ProductPrice>).data!.effective_from)}:
                        </p>
                        <div className="rounded-md bg-muted p-3 space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Harga Modal:</span>
                                <span className="font-medium">{formatCurrency((modals.delete as ModalWithData<ProductPrice>).data!.cost_price)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Harga Jual:</span>
                                <span className="font-medium">{formatCurrency((modals.delete as ModalWithData<ProductPrice>).data!.selling_price)}</span>
                            </div>
                        </div>
                        <p className="text-sm">Tindakan ini tidak dapat dibatalkan.</p>
                    </div>
                )}
            </DeleteConfirmDialog>
        </>
    );
}

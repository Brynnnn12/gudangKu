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
import type { ProductPrice, ProductForSelect } from '@/types/models/product-prices';
import { ProductPriceFormModal } from '@/pages/product-prices/components/ProductPriceFormModal';
import type { ModalState, ModalWithData } from '@/hooks/useGenericModals';

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
            <ProductPriceFormModal
                open={modals.create || modals.edit.isOpen}
                productPrice={(modals.edit as ModalWithData<ProductPrice>).data}
                products={products}
                onClose={() => {
                    if (modals.create) {
                        onCloseModal('create');
                    } else {
                        onCloseModal('edit');
                    }
                }}
            />

            <DeleteConfirmDialog
                open={modals.bulkDelete}
                title="Hapus Beberapa Harga"
                description={`Apakah Anda yakin ingin menghapus ${selectedCount} harga produk? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmBulkDelete}
                onClose={() => onCloseModal('bulkDelete')}
            />

            <DeleteConfirmDialog
                open={modals.delete.isOpen}
                title="Hapus Harga Produk"
                description=""
                onConfirm={onConfirmDelete}
                onClose={() => onCloseModal('delete')}
            >
                {modals.delete.productPrice && (
                    <div className="space-y-2 mt-2">
                        <p>
                            Hapus harga untuk "{modals.delete.productPrice.product?.name}" berlaku mulai{' '}
                            {formatDate(modals.delete.productPrice.effective_from)}:
                        </p>
                        <div className="rounded-md bg-muted p-3 space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Harga Modal:</span>
                                <span className="font-medium">{formatCurrency(modals.delete.productPrice.cost_price)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Harga Jual:</span>
                                <span className="font-medium">{formatCurrency(modals.delete.productPrice.selling_price)}</span>
                            </div>
                        </div>
                        <p className="text-sm">Tindakan ini tidak dapat dibatalkan.</p>
                    </div>
                )}
            </DeleteConfirmDialog>
        </>
    );
}

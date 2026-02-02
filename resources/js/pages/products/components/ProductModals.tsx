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
import CreateProductModal from '@/pages/products/create';
import EditProductModal from '@/pages/products/edit';
import type { Product, Category } from '@/types/models/products';

interface ModalState {
    create: boolean;
    edit: { isOpen: boolean; product: Product | null };
    delete: { isOpen: boolean; product: Product | null };
    bulkDelete: boolean;
}

interface ProductModalsProps {
    modals: ModalState;
    categories: Category[];
    onCloseModal: (type: keyof ModalState) => void;
    onConfirmDelete: () => void;
    onConfirmBulkDelete: () => void;
    selectedCount: number;
}

export function ProductModals({
    modals,
    categories,
    onCloseModal,
    onConfirmDelete,
    onConfirmBulkDelete,
    selectedCount,
}: ProductModalsProps) {
    return (
        <>
            <CreateProductModal
                open={modals.create}
                categories={categories}
                onClose={() => onCloseModal('create')}
            />

            {modals.edit.isOpen && modals.edit.product && (
                <EditProductModal
                    open={modals.edit.isOpen}
                    product={modals.edit.product}
                    categories={categories}
                    onClose={() => onCloseModal('edit')}
                />
            )}

            <AlertDialog open={modals.bulkDelete} onOpenChange={() => onCloseModal('bulkDelete')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Multiple Products</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedCount} product{selectedCount > 1 ? 's' : ''}?
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
                            This will delete the product "{modals.delete.product?.name}" (SKU: {modals.delete.product?.sku}).
                            This action cannot be undone.
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

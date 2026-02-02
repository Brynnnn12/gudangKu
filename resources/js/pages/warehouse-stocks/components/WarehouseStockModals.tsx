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
import CreateWarehouseStockModal from '@/pages/warehouse-stocks/create';
import EditWarehouseStockModal from '@/pages/warehouse-stocks/edit';
import type { Product } from '@/types/models/products';
import type { WarehouseStock } from '@/types/models/warehouse-stocks';
import type { Warehouse } from '@/types/models/warehouses';

interface ModalState {
    create: boolean;
    edit: { isOpen: boolean; warehouseStock: WarehouseStock | null };
    delete: { isOpen: boolean; warehouseStock: WarehouseStock | null };
    bulkDelete: boolean;
}

interface WarehouseStockModalsProps {
    modals: ModalState;
    warehouses: Warehouse[];
    products: Product[];
    onCloseModal: (type: keyof ModalState) => void;
    onConfirmDelete: () => void;
    onConfirmBulkDelete: () => void;
    selectedCount: number;
}

export function WarehouseStockModals({
    modals,
    warehouses,
    products,
    onCloseModal,
    onConfirmDelete,
    onConfirmBulkDelete,
    selectedCount,
}: WarehouseStockModalsProps) {
    return (
        <>
            <CreateWarehouseStockModal
                open={modals.create}
                warehouses={warehouses}
                products={products}
                onClose={() => onCloseModal('create')}
            />

            {modals.edit.isOpen && modals.edit.warehouseStock && (
                <EditWarehouseStockModal
                    open={modals.edit.isOpen}
                    warehouseStock={modals.edit.warehouseStock}
                    onClose={() => onCloseModal('edit')}
                />
            )}

            <AlertDialog open={modals.bulkDelete} onOpenChange={() => onCloseModal('bulkDelete')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Multiple Warehouse Stocks</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedCount} warehouse stock
                            {selectedCount > 1 ? 's' : ''}? This action cannot be undone.
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
                            This will delete the warehouse stock for "
                            {modals.delete.warehouseStock?.product?.name}" at "
                            {modals.delete.warehouseStock?.warehouse?.name}". This action cannot be
                            undone.
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

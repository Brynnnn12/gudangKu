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
import { WarehouseStockFormModal } from '@/pages/warehouse-stocks/components/WarehouseStockFormModal';
import type { Product } from '@/types/models/products';
import type { WarehouseStock } from '@/types/models/warehouse-stocks';
import type { Warehouse } from '@/types/models/warehouses';
import type { ModalState, ModalWithData } from '@/hooks/useGenericModals';

const DeleteConfirmDialog = ({
    open,
    title,
    description,
    onConfirm,
    onClose,
}: {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onClose: () => void;
}) => (
    <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
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

interface WarehouseStockModalsProps {
    modals: ModalState<WarehouseStock>;
    warehouses: Warehouse[];
    products: Product[];
    onCloseModal: (type: string) => void;
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
            <WarehouseStockFormModal
                open={modals.create || modals.edit.isOpen}
                warehouseStock={(modals.edit as ModalWithData<WarehouseStock>).data}
                warehouses={warehouses}
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
                title="Hapus Beberapa Stok Gudang"
                description={`Apakah Anda yakin ingin menghapus ${selectedCount} stok gudang? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmBulkDelete}
                onClose={() => onCloseModal('bulkDelete')}
            />

            <DeleteConfirmDialog
                open={modals.delete.isOpen}
                title="Hapus Stok Gudang"
                description={`Apakah Anda yakin ingin menghapus stok untuk "${modals.delete.warehouseStock?.product?.name}" di "${modals.delete.warehouseStock?.warehouse?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmDelete}
                onClose={() => onCloseModal('delete')}
            />
        </>
    );
}

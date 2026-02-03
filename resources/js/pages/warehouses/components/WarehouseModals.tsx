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
import type { Warehouse } from '@/types/models/warehouses';
import { WarehouseFormModal } from './WarehouseFormModal';

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

interface WarehouseModalsProps {
    modals: GenericModalState<Warehouse>;
    onCloseModal: (type: string) => void;
    onConfirmDelete: () => void;
    onConfirmBulkDelete: () => void;
    selectedCount: number;
}

export function WarehouseModals({
    modals,
    onCloseModal,
    onConfirmDelete,
    onConfirmBulkDelete,
    selectedCount,
}: WarehouseModalsProps) {
    return (
        <>
            <WarehouseFormModal
                open={modals.create as boolean}
                onClose={() => onCloseModal('create')}
            />

            <WarehouseFormModal
                open={(modals.edit as ModalWithData<Warehouse>).isOpen}
                warehouse={(modals.edit as ModalWithData<Warehouse>).data}
                onClose={() => onCloseModal('edit')}
            />

            <DeleteConfirmDialog
                open={modals.bulkDelete as boolean}
                title="Hapus Beberapa Gudang"
                description={`Apakah Anda yakin ingin menghapus ${selectedCount} gudang? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmBulkDelete}
                onClose={() => onCloseModal('bulkDelete')}
            />

            <DeleteConfirmDialog
                open={(modals.delete as ModalWithData<Warehouse>).isOpen}
                title="Hapus Gudang"
                description={`Apakah Anda yakin ingin menghapus gudang "${(modals.delete as ModalWithData<Warehouse>).data?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmDelete}
                onClose={() => onCloseModal('delete')}
            />
        </>
    );
}

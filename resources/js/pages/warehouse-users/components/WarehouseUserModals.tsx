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
import { WarehouseUserFormModal } from '@/pages/warehouse-users/components/WarehouseUserFormModal';
import type { WarehouseUser, Warehouse, User } from '@/types/models/warehouse-users';

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

interface WarehouseUserModalsProps {
    modals: GenericModalState<WarehouseUser>;
    warehouses: Warehouse[];
    users: User[];
    onCloseModal: (type: string) => void;
    onConfirmDelete: () => void;
    onConfirmBulkDelete: () => void;
    selectedCount: number;
}

export function WarehouseUserModals({
    modals,
    warehouses,
    users,
    onCloseModal,
    onConfirmDelete,
    onConfirmBulkDelete,
    selectedCount,
}: WarehouseUserModalsProps) {
    return (
        <>
            <WarehouseUserFormModal
                open={(modals.create as boolean) || (modals.edit as ModalWithData<WarehouseUser>).isOpen}
                warehouseUser={(modals.edit as ModalWithData<WarehouseUser>).data}
                warehouses={warehouses}
                users={users}
                onClose={() => {
                    if (modals.create) {
                        onCloseModal('create');
                    } else {
                        onCloseModal('edit');
                    }
                }}
            />

            <DeleteConfirmDialog
                open={modals.bulkDelete as boolean}
                title="Hapus Beberapa Penugasan"
                description={`Apakah Anda yakin ingin menghapus ${selectedCount} penugasan pengguna gudang? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmBulkDelete}
                onClose={() => onCloseModal('bulkDelete')}
            />

            <DeleteConfirmDialog
                open={(modals.delete as ModalWithData<WarehouseUser>).isOpen}
                title="Hapus Penugasan"
                description={`Apakah Anda yakin ingin menghapus penugasan "${(modals.delete as ModalWithData<WarehouseUser>).data?.warehouse?.name}" untuk "${(modals.delete as ModalWithData<WarehouseUser>).data?.user?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmDelete}
                onClose={() => onCloseModal('delete')}
            />
        </>
    );
}

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
import { EmployeeFormModal } from '@/pages/employees/components/EmployeeFormModal';
import type { User as EmployeeUser } from '@/types/models/employee';
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

interface EmployeeModalsProps {
    modals: ModalState<EmployeeUser>;
    onCloseModal: (type: string) => void;
    onConfirmDelete: () => void;
    onConfirmBulkDelete: () => void;
    selectedCount: number;
}

export function EmployeeModals({
    modals,
    onCloseModal,
    onConfirmDelete,
    onConfirmBulkDelete,
    selectedCount,
}: EmployeeModalsProps) {
    return (
        <>
            <EmployeeFormModal
                open={modals.create || modals.edit.isOpen}
                employee={(modals.edit as ModalWithData<EmployeeUser>).data}
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
                title="Hapus Beberapa Karyawan"
                description={`Apakah Anda yakin ingin menghapus ${selectedCount} karyawan? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmBulkDelete}
                onClose={() => onCloseModal('bulkDelete')}
            />

            <DeleteConfirmDialog
                open={modals.delete.isOpen}
                title="Hapus Karyawan"
                description={`Apakah Anda yakin ingin menghapus karyawan "${modals.delete.employee?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmDelete}
                onClose={() => onCloseModal('delete')}
            />
        </>
    );
}

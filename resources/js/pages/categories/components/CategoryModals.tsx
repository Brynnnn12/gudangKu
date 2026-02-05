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
import type { ModalState, ModalWithData } from '@/hooks/useGenericModals';
import type { Category } from '@/types/models/categories';

import { CategoryFormModal } from './CategoryFormModal';

interface CategoryModalsProps {
    modals: ModalState<Category>;
    onCloseModal: (type: string) => void;
    onConfirmDelete: () => void;
    onConfirmBulkDelete: () => void;
    selectedCount: number;
}

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

export function CategoryModals({
    modals,
    onCloseModal,
    onConfirmDelete,
    onConfirmBulkDelete,
    selectedCount,
}: CategoryModalsProps) {
    return (
        <>
            <CategoryFormModal
                open={typeof modals.create === 'boolean' ? modals.create : modals.create.isOpen}
                onClose={() => onCloseModal('create')}
            />

            <CategoryFormModal
                open={(modals.edit as ModalWithData<Category>).isOpen}
                category={(modals.edit as ModalWithData<Category>).data}
                onClose={() => onCloseModal('edit')}
            />

            <DeleteConfirmDialog
                open={typeof modals.bulkDelete === 'boolean' ? modals.bulkDelete : modals.bulkDelete.isOpen}
                title="Hapus Beberapa Kategori"
                description={`Apakah Anda yakin ingin menghapus ${selectedCount} kategori? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmBulkDelete}
                onClose={() => onCloseModal('bulkDelete')}
            />

            <DeleteConfirmDialog
                open={(modals.delete as ModalWithData<Category>).isOpen}
                title="Hapus Kategori"
                description={`Apakah Anda yakin ingin menghapus kategori "${(modals.delete as ModalWithData<Category>).data?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={onConfirmDelete}
                onClose={() => onCloseModal('delete')}
            />
        </>
    );
}

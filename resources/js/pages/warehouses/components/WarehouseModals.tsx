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
import { WarehouseFormModal } from './WarehouseFormModal';
import type { WarehouseModalState } from '@/hooks/useWarehouseModals';

interface WarehouseModalsProps {
    modals: WarehouseModalState;
    onCloseModal: (type: keyof WarehouseModalState) => void;
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
            {/* Create Modal */}
            <WarehouseFormModal
                open={modals.create}
                onClose={() => onCloseModal('create')}
            />

            {/* Edit Modal */}
            <WarehouseFormModal
                open={modals.edit.isOpen}
                warehouse={modals.edit.warehouse}
                onClose={() => onCloseModal('edit')}
            />

            {/* Bulk Delete Confirmation Modal */}
            <AlertDialog open={modals.bulkDelete} onOpenChange={() => onCloseModal('bulkDelete')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Multiple Warehouses</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedCount} warehouse{selectedCount > 1 ? 's' : ''}?
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

            {/* Delete Confirmation Modal */}
            <AlertDialog open={modals.delete.isOpen} onOpenChange={() => onCloseModal('delete')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete the warehouse "{modals.delete.warehouse?.name}".
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

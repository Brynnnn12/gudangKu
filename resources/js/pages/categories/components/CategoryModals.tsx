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
import { CategoryFormModal } from './CategoryFormModal';
import type { CategoryModalState } from '@/hooks/useCategoryModals';

interface CategoryModalsProps {
    modals: CategoryModalState;
    onCloseModal: (type: keyof CategoryModalState) => void;
    onConfirmDelete: () => void;
    onConfirmBulkDelete: () => void;
    selectedCount: number;
}

export function CategoryModals({
    modals,
    onCloseModal,
    onConfirmDelete,
    onConfirmBulkDelete,
    selectedCount,
}: CategoryModalsProps) {
    return (
        <>
            {/* Create Modal */}
            <CategoryFormModal
                open={modals.create}
                onClose={() => onCloseModal('create')}
            />

            {/* Edit Modal */}
            <CategoryFormModal
                open={modals.edit.isOpen}
                category={modals.edit.category}
                onClose={() => onCloseModal('edit')}
            />

            {/* Bulk Delete Confirmation Modal */}
            <AlertDialog open={modals.bulkDelete} onOpenChange={() => onCloseModal('bulkDelete')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Multiple Categories</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedCount} categor{selectedCount > 1 ? 'ies' : 'y'}?
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
                            This will delete the category "{modals.delete.category?.name}".
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

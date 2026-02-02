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
import CreateWarehouseUserModal from '@/pages/warehouse-users/create';
import EditWarehouseUserModal from '@/pages/warehouse-users/edit';
import type { WarehouseUser, Warehouse, User } from '@/types/models/warehouse-users';

interface ModalState {
    create: boolean;
    edit: { isOpen: boolean; warehouseUser: WarehouseUser | null };
    delete: { isOpen: boolean; warehouseUser: WarehouseUser | null };
    bulkDelete: boolean;
}

interface WarehouseUserModalsProps {
    modals: ModalState;
    warehouses: Warehouse[];
    users: User[];
    onCloseModal: (type: keyof ModalState) => void;
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
            {/* Create Modal */}
            <CreateWarehouseUserModal
                open={modals.create}
                warehouses={warehouses}
                users={users}
                onClose={() => onCloseModal('create')}
            />

            {/* Edit Modal */}
            {modals.edit.isOpen && modals.edit.warehouseUser && (
                <EditWarehouseUserModal
                    open={modals.edit.isOpen}
                    warehouseUser={modals.edit.warehouseUser}
                    warehouses={warehouses}
                    users={users}
                    onClose={() => onCloseModal('edit')}
                />
            )}

            {/* Bulk Delete Confirmation Modal */}
            <AlertDialog open={modals.bulkDelete} onOpenChange={() => onCloseModal('bulkDelete')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Multiple Warehouse Users</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedCount} warehouse user{selectedCount > 1 ? 's' : ''}?
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
                            This will delete the warehouse user assignment for "{modals.delete.warehouseUser?.warehouse?.name}" and "{modals.delete.warehouseUser?.user?.name}".
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

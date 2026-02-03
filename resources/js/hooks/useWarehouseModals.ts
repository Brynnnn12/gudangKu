import { useState, useCallback } from 'react';
import type { Warehouse } from '@/types/models/warehouses';

export interface WarehouseModalState {
    create: boolean;
    edit: { isOpen: boolean; warehouse: Warehouse | null };
    delete: { isOpen: boolean; warehouse: Warehouse | null };
    bulkDelete: boolean;
}

type ModalType = keyof WarehouseModalState;

export function useWarehouseModals() {
    const [modals, setModals] = useState<WarehouseModalState>({
        create: false,
        edit: { isOpen: false, warehouse: null },
        delete: { isOpen: false, warehouse: null },
        bulkDelete: false,
    });

    const openModal = useCallback((type: ModalType, data?: Warehouse) => {
        setModals(prev => {
            if (type === 'create' || type === 'bulkDelete') {
                return { ...prev, [type]: true };
            }
            return { ...prev, [type]: { isOpen: true, warehouse: data || null } };
        });
    }, []);

    const closeModal = useCallback((type: ModalType) => {
        setModals(prev => {
            if (type === 'create' || type === 'bulkDelete') {
                return { ...prev, [type]: false };
            }
            return { ...prev, [type]: { isOpen: false, warehouse: null } };
        });
    }, []);

    return {
        modals,
        openModal,
        closeModal,
    };
}

import { useState, useCallback } from 'react';
import type { Category } from '@/types/models/categories';

export interface CategoryModalState {
    create: boolean;
    edit: { isOpen: boolean; category: Category | null };
    delete: { isOpen: boolean; category: Category | null };
    bulkDelete: boolean;
}

type ModalType = keyof CategoryModalState;

export function useCategoryModals() {
    const [modals, setModals] = useState<CategoryModalState>({
        create: false,
        edit: { isOpen: false, category: null },
        delete: { isOpen: false, category: null },
        bulkDelete: false,
    });

    const openModal = useCallback((type: ModalType, data?: Category) => {
        setModals(prev => {
            if (type === 'create' || type === 'bulkDelete') {
                return { ...prev, [type]: true };
            }
            return { ...prev, [type]: { isOpen: true, category: data || null } };
        });
    }, []);

    const closeModal = useCallback((type: ModalType) => {
        setModals(prev => {
            if (type === 'create' || type === 'bulkDelete') {
                return { ...prev, [type]: false };
            }
            return { ...prev, [type]: { isOpen: false, category: null } };
        });
    }, []);

    return {
        modals,
        openModal,
        closeModal,
    };
}

import { useState, useCallback } from 'react';

/**
 * Generic Modal State that can be used with any entity type
 * @template T - The entity type (e.g., Product, Category, etc.)
 */
export type ModalState<T> = {
    [K: string]: boolean | { isOpen: boolean; data: T | null };
};

export type ModalType = string;

/**
 * Configuration for defining modal types
 * @example
 * const config: ModalConfig = {
 *   simple: ['create', 'bulkDelete'],
 *   withData: ['edit', 'delete']
 * }
 */
export interface ModalConfig {
    simple?: string[];      // Modals that don't need data (e.g., 'create', 'bulkDelete')
    withData?: string[];    // Modals that need data (e.g., 'edit', 'delete', 'approve', 'reject')
}

/**
 * Generic Modal Hook with TypeScript Generics
 * Provides type-safe modal state management for any entity
 *
 * @template T - The entity type
 * @param config - Configuration object defining modal types
 *
 * @example
 * // For Products
 * const { modals, openModal, closeModal } = useGenericModals<Product>({
 *   simple: ['create', 'bulkDelete'],
 *   withData: ['edit', 'delete']
 * });
 *
 * @example
 * // For Stock Transfers with custom modals
 * const { modals, openModal, closeModal } = useGenericModals<StockTransfer>({
 *   simple: ['create'],
 *   withData: ['approve', 'reject', 'delete']
 * });
 */
export function useGenericModals<T = unknown>(config: ModalConfig) {
    const { simple = [], withData = [] } = config;

    // Initialize state based on configuration
    const initialState: ModalState<T> = {};
    simple.forEach(key => {
        initialState[key] = false;
    });
    withData.forEach(key => {
        initialState[key] = { isOpen: false, data: null };
    });

    const [modals, setModals] = useState<ModalState<T>>(initialState);

    /**
     * Open a modal
     * @param type - The modal type to open
     * @param data - Optional data for modals that need it
     */
    const openModal = useCallback((type: ModalType, data?: T) => {
        setModals(prev => {
            if (simple.includes(type)) {
                return { ...prev, [type]: true };
            }
            return { ...prev, [type]: { isOpen: true, data: data || null } };
        });
    }, [simple]);

    /**
     * Close a modal
     * @param type - The modal type to close
     */
    const closeModal = useCallback((type: ModalType) => {
        setModals(prev => {
            if (simple.includes(type)) {
                return { ...prev, [type]: false };
            }
            return { ...prev, [type]: { isOpen: false, data: null } };
        });
    }, [simple]);

    return {
        modals,
        openModal,
        closeModal,
    };
}

/**
 * Type helper to extract modal state value
 * @example
 * const editModal = modals.edit as ModalWithData<Product>;
 * const createModal = modals.create as boolean;
 */
export type ModalWithData<T> = {
    open: boolean; isOpen: boolean; data: T | null
};

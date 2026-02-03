import { useState, useCallback, useMemo } from 'react';

export function useSelection<T extends { id: number }>(items: T[]) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelectAll = useCallback((checked: boolean) => {
        setSelectedIds(checked ? items.map(item => item.id) : []);
    }, [items]);

    const toggleSelectOne = useCallback((id: number, checked: boolean) => {
        setSelectedIds(prev =>
            checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
        );
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    const allSelected = useMemo(
        () => items.length > 0 && selectedIds.length === items.length,
        [items, selectedIds]
    );

    const someSelected = useMemo(
        () => selectedIds.length > 0 && selectedIds.length < items.length,
        [items, selectedIds]
    );

    return {
        selectedIds,
        toggleSelectAll,
        toggleSelectOne,
        clearSelection,
        allSelected,
        someSelected,
        selectedCount: selectedIds.length,
    };
}

import { router, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

interface UseFiltersOptions {
    route: string;
    initialFilters: Record<string, string>;
    debounceMs?: number;
    only?: string[];
}

export function useFilters({
    route,
    initialFilters,
    debounceMs = 300,
    only = [],
}: UseFiltersOptions) {
    const filterForm = useForm(initialFilters);
    const previousFilters = useRef(initialFilters);

    useEffect(() => {
        // Only trigger if filters actually changed
        const hasChanged = Object.keys(initialFilters).some(
            key => previousFilters.current[key] !== filterForm.data[key]
        );

        if (!hasChanged) {
            return;
        }

        previousFilters.current = filterForm.data;

        const timer = setTimeout(() => {
            // Get current URL params to preserve pagination
            const currentParams = new URLSearchParams(window.location.search);
            const params: Record<string, string> = {};

            // Copy all existing params except page (reset to 1 when filters change)
            currentParams.forEach((value, key) => {
                if (key !== 'page') {
                    params[key] = value;
                }
            });

            // Update filter params - only include non-empty values
            Object.entries(filterForm.data).forEach(([key, value]) => {
                if (value) {
                    params[key] = String(value);
                } else {
                    delete params[key];
                }
            });

            router.get(
                route,
                params,
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: only.length > 0 ? only : undefined,
                }
            );
        }, debounceMs);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...Object.values(filterForm.data)]);

    const clearFilters = () => {
        filterForm.setData(initialFilters);
        router.get(route, {}, {
            replace: true,
            preserveState: false,
            only: only.length > 0 ? only : undefined,
        });
    };

    const hasActiveFilters = Object.values(filterForm.data).some(value => !!value);

    return {
        filters: filterForm.data,
        setFilter: (key: string, value: string) => filterForm.setData(key as keyof typeof filterForm.data, value),
        setFilters: (data: Record<string, string>) => filterForm.setData(data),
        clearFilters,
        isFiltering: filterForm.processing,
        hasActiveFilters,
    };
}

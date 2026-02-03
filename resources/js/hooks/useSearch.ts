import { router, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

interface UseSearchOptions {
    route: string;
    initialSearch?: string;
    debounceMs?: number;
    only?: string[];
}

export function useSearch({
    route,
    initialSearch = '',
    debounceMs = 300,
    only = [],
}: UseSearchOptions) {
    const searchForm = useForm({
        search: initialSearch,
    });

    const previousSearch = useRef(initialSearch);

    useEffect(() => {
        // Only trigger if search actually changed
        if (previousSearch.current === searchForm.data.search) {
            return;
        }

        previousSearch.current = searchForm.data.search;

        const timer = setTimeout(() => {
            // Get current URL params to preserve pagination
            const currentParams = new URLSearchParams(window.location.search);
            const params: Record<string, string> = {};

            // Copy all existing params except page (reset to 1 when search changes)
            currentParams.forEach((value, key) => {
                if (key !== 'page') {
                    params[key] = value;
                }
            });

            // Update search param
            if (searchForm.data.search) {
                params.search = searchForm.data.search;
            } else {
                delete params.search;
            }

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
    }, [searchForm.data.search]);

    const clearSearch = () => {
        searchForm.setData({ search: '' });
    };

    const hasActiveSearch = !!searchForm.data.search;

    return {
        searchValue: searchForm.data.search,
        setSearchValue: (value: string) => searchForm.setData('search', value),
        clearSearch,
        isSearching: searchForm.processing,
        hasActiveSearch,
    };
}

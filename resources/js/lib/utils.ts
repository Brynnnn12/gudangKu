import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatCurrency(value: string | number): string {
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(value));
    return `Rp ${formatted}`;
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function calculateMargin(costPrice: string | number, sellingPrice: string | number): string {
    const cost = Number(costPrice);
    const selling = Number(sellingPrice);
    const margin = ((selling - cost) / cost) * 100;
    return margin.toFixed(1) + '%';
}

export function generateBatchNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BATCH-${timestamp}-${random}`;
}

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FefoWarnings } from '@/pages/dashboard/FefoWarnings';
import { RecentActivities } from '@/pages/dashboard/RecentActivities';
import { StockByWarehouseChart } from '@/pages/dashboard/StockByWarehouseChart';
import { RevenueVsCostChart } from '@/pages/dashboard/StockMovementChart';
import { SummaryCards } from '@/pages/dashboard/SummaryCards';
import { TopSellingProductsChart } from '@/pages/dashboard/TopSellingProductsChart';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface DashboardProps {
    summaryCards: {
        financial: {
            revenue: number;
            costs: number;
            profit: number;
            profitMargin: number;
        };
        nearExpiry: {
            count: number;
        };
        stockMovement: {
            stockIn: number;
            stockOut: number;
        };
    };
    stockByWarehouse: Array<{
        name: string;
        items: number;
        quantity: number;
    }>;
    topSellingProducts: Array<{
        name: string;
        sku: string;
        total: number;
    }>;
    revenueVsCost: Array<{
        date: string;
        revenue: number;
        costs: number;
        profit: number;
    }>;
    recentActivities: Array<{
        id: number;
        warehouse: string;
        product: string;
        sku: string;
        qty: number;
        type: string;
        user: string;
        notes: string | null;
        created_at: string;
    }>;
    fefoWarnings: Array<{
        id: number;
        batch_number: string;
        warehouse: string;
        product: string;
        sku: string;
        qty: number;
        expired_at: string;
        status: string;
        days_until_expiry: number | null;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    summaryCards,
    stockByWarehouse,
    topSellingProducts,
    revenueVsCost,
    recentActivities,
    fefoWarnings,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Analitik" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard Analitik</h1>
                        <p className="text-muted-foreground">Ringkasan finansial dan performa bisnis</p>
                    </div>
                </div>

                {/* Summary Cards - 3 Cards */}
                <SummaryCards {...summaryCards} />

                {/* Charts Row - 2 Charts */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <RevenueVsCostChart data={revenueVsCost} />
                    <TopSellingProductsChart data={topSellingProducts} />
                </div>

                {/* Stock by Warehouse */}
                <StockByWarehouseChart data={stockByWarehouse} />

                {/* FEFO Warnings (Priority) */}
                {fefoWarnings.length > 0 && <FefoWarnings data={fefoWarnings} />}

                {/* Recent Activities */}
                <RecentActivities data={recentActivities} />
            </div>
        </AppLayout>
    );
}

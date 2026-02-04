<?php

namespace App\Console\Commands;

use App\Jobs\SendReportNotification;
use App\Models\StockLog;
use App\Models\User;
use App\Models\WarehouseStock;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SendStockReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'report:send-stock {period=weekly : Report period (weekly or monthly)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send stock report (in/out, warehouse stocks) to viewers via WhatsApp';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $period = $this->argument('period');

        if (! in_array($period, ['weekly', 'monthly'])) {
            $this->error('Invalid period. Use "weekly" or "monthly".');

            return Command::FAILURE;
        }

        $this->info("Generating {$period} stock report...");

        // Determine date range
        $dateRange = $this->getDateRange($period);
        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];

        // Get report data
        $stockMovement = $this->getStockMovement($startDate, $endDate);
        $warehouseStocks = $this->getWarehouseStocks();

        // Build message
        $message = $this->buildReportMessage($period, $startDate, $endDate, $stockMovement, $warehouseStocks);

        // Send to viewers
        $viewers = User::role('viewer')
            ->whereNotNull('phone_number')
            ->get();

        foreach ($viewers as $viewer) {
            SendReportNotification::dispatch($viewer->phone_number, $message);
        }

        $this->info("Report sent to {$viewers->count()} viewers.");

        return Command::SUCCESS;
    }

    /**
     * Get date range based on period
     */
    protected function getDateRange(string $period): array
    {
        if ($period === 'weekly') {
            return [
                'start' => Carbon::now()->startOfWeek(),
                'end' => Carbon::now()->endOfWeek(),
            ];
        }

        return [
            'start' => Carbon::now()->startOfMonth(),
            'end' => Carbon::now()->endOfMonth(),
        ];
    }

    /**
     * Get stock movement (in/out) data
     */
    protected function getStockMovement(Carbon $startDate, Carbon $endDate): array
    {
        $stockIn = StockLog::where('type', 'in')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('qty');

        $stockOut = StockLog::where('type', 'out')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('qty');

        $topProductsIn = StockLog::select('product_id', DB::raw('SUM(qty) as total_in'))
            ->with('product:id,name,sku')
            ->where('type', 'in')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('product_id')
            ->orderByDesc('total_in')
            ->limit(5)
            ->get();

        $topProductsOut = StockLog::select('product_id', DB::raw('SUM(qty) as total_out'))
            ->with('product:id,name,sku')
            ->where('type', 'out')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('product_id')
            ->orderByDesc('total_out')
            ->limit(5)
            ->get();

        return [
            'stock_in' => $stockIn,
            'stock_out' => $stockOut,
            'top_products_in' => $topProductsIn,
            'top_products_out' => $topProductsOut,
        ];
    }

    /**
     * Get warehouse stocks data
     */
    protected function getWarehouseStocks(): array
    {
        $warehouseStocks = WarehouseStock::with(['warehouse:id,name', 'product:id,name,sku'])
            ->where('total_quantity', '>', 0)
            ->get()
            ->groupBy('warehouse.name')
            ->map(function ($stocks) {
                return [
                    'total_items' => $stocks->count(),
                    'total_qty' => $stocks->sum('total_quantity'),
                    'stocks' => $stocks->take(5), // Top 5 products per warehouse
                ];
            });

        return $warehouseStocks->toArray();
    }

    /**
     * Build WhatsApp message
     */
    protected function buildReportMessage(string $period, Carbon $startDate, Carbon $endDate, array $stockMovement, array $warehouseStocks): string
    {
        $periodLabel = $period === 'weekly' ? 'MINGGUAN' : 'BULANAN';
        $dateRange = $startDate->format('d/m/Y').' - '.$endDate->format('d/m/Y');

        $message = "*LAPORAN STOK {$periodLabel}*\n";
        $message .= "📅 Periode: {$dateRange}\n\n";

        // Stock Movement Summary
        $message .= "📊 *RINGKASAN PERGERAKAN STOK*\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━\n";
        $message .= "📥 Stok Masuk: *".number_format($stockMovement['stock_in'])."* unit\n";
        $message .= "📤 Stok Keluar: *".number_format($stockMovement['stock_out'])."* unit\n";
        $message .= "📈 Selisih: *".number_format($stockMovement['stock_in'] - $stockMovement['stock_out'])."* unit\n\n";

        // Top Products In
        if ($stockMovement['top_products_in']->isNotEmpty()) {
            $message .= "🔝 *TOP 5 PRODUK MASUK*\n";
            foreach ($stockMovement['top_products_in'] as $index => $item) {
                $no = $index + 1;
                $message .= "{$no}. {$item->product->name}\n";
                $message .= "   SKU: {$item->product->sku} | Qty: ".number_format($item->total_in)."\n";
            }
            $message .= "\n";
        }

        // Top Products Out
        if ($stockMovement['top_products_out']->isNotEmpty()) {
            $message .= "🔝 *TOP 5 PRODUK KELUAR*\n";
            foreach ($stockMovement['top_products_out'] as $index => $item) {
                $no = $index + 1;
                $message .= "{$no}. {$item->product->name}\n";
                $message .= "   SKU: {$item->product->sku} | Qty: ".number_format($item->total_out)."\n";
            }
            $message .= "\n";
        }

        // Warehouse Stocks
        $message .= "🏢 *STOK PER GUDANG*\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━\n";
        foreach ($warehouseStocks as $warehouseName => $data) {
            $message .= "\n*{$warehouseName}*\n";
            $message .= "Total Items: {$data['total_items']} | Total Qty: ".number_format($data['total_qty'])."\n";

            if (! empty($data['stocks'])) {
                foreach ($data['stocks'] as $stock) {
                    $message .= "• {$stock['product']['name']} ({$stock['product']['sku']}): ".number_format($stock['total_quantity'])."\n";
                }
            }
        }

        $message .= "\n\n_Laporan otomatis dari sistem GudangKu_";

        return $message;
    }
}

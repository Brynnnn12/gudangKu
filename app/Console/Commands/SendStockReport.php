<?php

namespace App\Console\Commands;

use App\Jobs\SendReportNotification;
use App\Models\StockLog;
use App\Models\User;
use App\Models\WarehouseStock;
use Carbon\Carbon;
use Illuminate\Console\Command;

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

        // Determine notification channel and recipient field
        $channel = config('services.notification_channel', 'whatsapp');
        $recipientField = $channel === 'email' ? 'email' : 'phone_number';

        // Send to viewers
        $viewers = User::role('viewer')
            ->whereNotNull($recipientField)
            ->get();

        foreach ($viewers as $viewer) {
            $recipient = $channel === 'email' ? $viewer->email : $viewer->phone_number;

            if ($channel === 'email') {
                // For email, send structured data for Mailable as JSON
                $mailableData = $this->buildEmailData($period, $startDate, $endDate, $stockMovement, $warehouseStocks);
                $mailableDataJson = json_encode([
                    'mailable' => 'StockReportMail',
                    'data' => $mailableData,
                ]);
                $subject = 'Laporan Stock '.ucfirst($period).' GudangKu';
                SendReportNotification::dispatch($recipient, '', $subject, $mailableDataJson);
            } else {
                // For WhatsApp, send plain text message
                $message = $this->buildWhatsAppMessage($period, $startDate, $endDate, $stockMovement, $warehouseStocks);
                SendReportNotification::dispatch($recipient, $message);
            }
        }

        $this->info("Report sent to {$viewers->count()} viewers via {$channel}.");

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
     * Get stock movement (in/out) data with financial info
     */
    protected function getStockMovement(Carbon $startDate, Carbon $endDate): array
    {
        // Stock In (entry - qty positive and costs)
        $stockInData = StockLog::join('stock_batches', 'stock_logs.batch_id', '=', 'stock_batches.id')
            ->where('stock_logs.type', 'entry')
            ->whereBetween('stock_logs.created_at', [$startDate, $endDate])
            ->selectRaw('SUM(ABS(stock_logs.qty)) as total_qty, SUM(ABS(stock_logs.qty) * stock_batches.cost_price) as total_costs')
            ->first();

        // Stock Out (exit - qty negative and revenue)
        $stockOutData = StockLog::join('stock_batches', 'stock_logs.batch_id', '=', 'stock_batches.id')
            ->join('warehouse_stocks', 'stock_batches.warehouse_stock_id', '=', 'warehouse_stocks.id')
            ->join('products', 'warehouse_stocks.product_id', '=', 'products.id')
            ->leftJoin('product_prices', function ($join) {
                $join->on('products.id', '=', 'product_prices.product_id')
                    ->whereRaw('product_prices.effective_from <= stock_logs.created_at')
                    ->whereRaw('product_prices.effective_from = (SELECT MAX(effective_from) FROM product_prices WHERE product_id = products.id AND effective_from <= stock_logs.created_at)');
            })
            ->where('stock_logs.type', 'exit')
            ->whereBetween('stock_logs.created_at', [$startDate, $endDate])
            ->selectRaw('SUM(ABS(stock_logs.qty)) as total_qty, SUM(ABS(stock_logs.qty) * COALESCE(product_prices.selling_price, stock_batches.cost_price * 1.3)) as total_revenue')
            ->first();

        $stockIn = $stockInData->total_qty ?? 0;
        $totalCosts = $stockInData->total_costs ?? 0;
        $stockOut = $stockOutData->total_qty ?? 0;
        $totalRevenue = $stockOutData->total_revenue ?? 0;
        $profit = $totalRevenue - $totalCosts;

        return [
            'stock_in' => $stockIn,
            'stock_out' => $stockOut,
            'total_costs' => $totalCosts,
            'total_revenue' => $totalRevenue,
            'profit' => $profit,
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
     * Build email data for Mailable
     */
    protected function buildEmailData(string $period, Carbon $startDate, Carbon $endDate, array $stockMovement, array $warehouseStocks): array
    {
        $warehouses = [];
        foreach ($warehouseStocks as $name => $data) {
            $warehouses[] = [
                'name' => $name,
                'items' => $data['total_items'],
                'qty' => $data['total_qty'],
            ];
        }

        $grandTotalItems = array_sum(array_column($warehouses, 'items'));
        $grandTotalQty = array_sum(array_column($warehouses, 'qty'));

        return [
            'period' => $period,
            'dateRange' => $startDate->format('d/m/Y').' - '.$endDate->format('d/m/Y'),
            'totalCosts' => $stockMovement['total_costs'],
            'totalRevenue' => $stockMovement['total_revenue'],
            'profit' => $stockMovement['profit'],
            'stockIn' => $stockMovement['stock_in'],
            'stockOut' => $stockMovement['stock_out'],
            'warehouses' => $warehouses,
            'totalItems' => $grandTotalItems,
            'totalQty' => $grandTotalQty,
        ];
    }

    /**
     * Build WhatsApp message (plain text)
     */
    protected function buildWhatsAppMessage(string $period, Carbon $startDate, Carbon $endDate, array $stockMovement, array $warehouseStocks): string
    {
        $periodLabel = $period === 'weekly' ? 'MINGGUAN' : 'BULANAN';
        $dateRange = $startDate->format('d/m/Y').' - '.$endDate->format('d/m/Y');

        $message = "*📊 LAPORAN {$periodLabel}*\n";
        $message .= "📅 {$dateRange}\n\n";

        // Financial Summary
        $profit = $stockMovement['profit'];
        $profitIcon = $profit >= 0 ? '📈' : '📉';

        $message .= "💰 *FINANSIAL*\n";
        $message .= '• Pengeluaran: Rp '.number_format($stockMovement['total_costs'], 0, ',', '.')."\n";
        $message .= '• Pemasukan: Rp '.number_format($stockMovement['total_revenue'], 0, ',', '.')."\n";
        $message .= "{$profitIcon} Profit: *Rp ".number_format(abs($profit), 0, ',', '.')."*\n\n";

        // Stock Movement
        $message .= "📦 *PERGERAKAN STOK*\n";
        $message .= '• Masuk: '.number_format($stockMovement['stock_in'])." unit\n";
        $message .= '• Keluar: '.number_format($stockMovement['stock_out'])." unit\n\n";

        // Warehouse Stocks Summary (compact version)
        $message .= "🏢 *STOK SAAT INI*\n";

        $grandTotalItems = 0;
        $grandTotalQty = 0;
        $warehouseCount = count($warehouseStocks);

        // Show details if 3 or fewer warehouses, otherwise just summary
        if ($warehouseCount <= 3) {
            foreach ($warehouseStocks as $warehouseName => $data) {
                $grandTotalItems += $data['total_items'];
                $grandTotalQty += $data['total_qty'];
                $message .= "• {$warehouseName}: {$data['total_items']} items, ".number_format($data['total_qty'])." unit\n";
            }
        } else {
            foreach ($warehouseStocks as $data) {
                $grandTotalItems += $data['total_items'];
                $grandTotalQty += $data['total_qty'];
            }
            $message .= "• {$warehouseCount} gudang aktif\n";
        }

        $message .= '• *Total: '.$grandTotalItems.' items, '.number_format($grandTotalQty)." unit*\n\n";

        $message .= '_Sistem GudangKu_';

        return $message;
    }
}

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
    protected $signature = 'report:send-stock {period=weekly}';

    protected $description = 'Kirim laporan stok (mingguan/bulanan) via WhatsApp/Email';

    public function handle()
    {
        $period = $this->argument('period');
        if (! in_array($period, ['weekly', 'monthly'])) {
            $this->error('Periode tidak valid. Gunakan weekly atau monthly.');

            return Command::FAILURE;
        }

        $this->info("Menghasilkan laporan stok {$period}...");

        $range = $this->getDateRange($period);
        $movement = $this->getStockMovement($range['start'], $range['end']);
        $warehouseData = $this->getWarehouseStocks();

        $channel = config('services.notification_channel', 'whatsapp');
        $field = $channel === 'email' ? 'email' : 'phone_number';
        $viewers = User::role('viewer')->whereNotNull($field)->get();

        foreach ($viewers as $viewer) {
            $recipient = $viewer->$field;

            if ($channel === 'email') {
                $mailData = $this->buildEmailData($period, $range, $movement, $warehouseData);
                $json = json_encode(['mailable' => 'StockReportMail', 'data' => $mailData]);
                SendReportNotification::dispatch($recipient, '', 'Laporan Stok GudangKu', $json);
            } else {
                $msg = $this->buildWhatsAppMessage($period, $range, $movement, $warehouseData);
                SendReportNotification::dispatch($recipient, $msg);
            }
        }

        $this->info("Laporan terkirim ke {$viewers->count()} viewer.");

        return Command::SUCCESS;
    }

    protected function getDateRange(string $period): array
    {
        $now = Carbon::now();

        return [
            'start' => $period === 'weekly' ? $now->copy()->startOfWeek() : $now->copy()->startOfMonth(),
            'end' => $period === 'weekly' ? $now->copy()->endOfWeek() : $now->copy()->endOfMonth(),
        ];
    }

    protected function getStockMovement(Carbon $start, Carbon $end): array
    {
        $in = StockLog::join('stock_batches', 'stock_logs.batch_id', '=', 'stock_batches.id')
            ->where('stock_logs.type', 'entry')
            ->whereBetween('stock_logs.created_at', [$start, $end])
            ->selectRaw('SUM(ABS(qty)) as total_qty, SUM(ABS(qty) * cost_price) as total_costs')
            ->first();

        $out = StockLog::join('stock_batches', 'stock_logs.batch_id', '=', 'stock_batches.id')
            ->join('warehouse_stocks', 'stock_batches.warehouse_stock_id', '=', 'warehouse_stocks.id')
            ->join('products', 'warehouse_stocks.product_id', '=', 'products.id')
            ->leftJoin('product_prices', function ($join) {
                $join->on('products.id', '=', 'product_prices.product_id')
                    ->whereRaw('product_prices.effective_from <= stock_logs.created_at');
            })
            ->where('stock_logs.type', 'exit')
            ->whereBetween('stock_logs.created_at', [$start, $end])
            ->selectRaw('SUM(ABS(qty)) as total_qty, SUM(ABS(qty) * COALESCE(selling_price, cost_price * 1.3)) as total_rev')
            ->first();

        return [
            'in' => $in->total_qty ?? 0,
            'out' => $out->total_qty ?? 0,
            'costs' => $in->total_costs ?? 0,
            'rev' => $out->total_rev ?? 0,
            'profit' => ($out->total_rev ?? 0) - ($in->total_costs ?? 0),
        ];
    }

    protected function getWarehouseStocks(): array
    {
        return WarehouseStock::with(['warehouse', 'product'])
            ->where('total_quantity', '>', 0)
            ->get()
            ->groupBy('warehouse.name')
            ->map(fn ($s) => ['items' => $s->count(), 'qty' => $s->sum('total_quantity')])
            ->toArray();
    }

    protected function buildEmailData($period, $range, $move, $wh): array
    {
        $warehouses = collect($wh)->map(fn ($d, $name) => [
            'name' => $name, 'items' => $d['items'], 'qty' => $d['qty'],
        ])->values()->toArray();

        return [
            'period' => $period,
            'dateRange' => $range['start']->format('d/m/Y').' - '.$range['end']->format('d/m/Y'),
            'totalCosts' => $move['costs'],
            'totalRevenue' => $move['rev'],
            'profit' => $move['profit'],
            'stockIn' => $move['in'],
            'stockOut' => $move['out'],
            'warehouses' => $warehouses,
            'totalItems' => array_sum(array_column($warehouses, 'items')),
            'totalQty' => array_sum(array_column($warehouses, 'qty')),
        ];
    }

    protected function buildWhatsAppMessage($period, $range, $move, $wh): string
    {
        $label = $period === 'weekly' ? 'MINGGUAN' : 'BULANAN';
        $icon = $move['profit'] >= 0 ? '📈' : '📉';
        $uniqueId = bin2hex(random_bytes(2));

        $msg = "*📊 LAPORAN STOK {$label}*\n";
        $msg .= '📅 '.$range['start']->format('d/m/Y').' - '.$range['end']->format('d/m/Y')."\n\n";

        $msg .= "💰 *FINANSIAL*\n";
        $msg .= '• Biaya: Rp '.number_format($move['costs'], 0, ',', '.')."\n";
        $msg .= '• Omzet: Rp '.number_format($move['rev'], 0, ',', '.')."\n";
        $msg .= "$icon *Profit: Rp ".number_format(abs($move['profit']), 0, ',', '.')."*\n\n";

        $msg .= "📦 *PERGERAKAN*\n";
        $msg .= '• Masuk: '.number_format($move['in'])." unit\n";
        $msg .= '• Keluar: '.number_format($move['out'])." unit\n\n";

        $msg .= "🏢 *RINGKASAN GUDANG*\n";
        foreach (array_slice($wh, 0, 3, true) as $name => $data) {
            $msg .= "• $name: ".number_format($data['qty'])." unit\n";
        }

        if (count($wh) > 3) {
            $msg .= '• ...dan '.(count($wh) - 3)." gudang lainnya\n";
        }

        $msg .= "\n_Sistem GudangKu_ [#$uniqueId]";

        return $msg;
    }
}

<?php

namespace App\Console\Commands;

use App\Jobs\SendWaExpiredNotification;
use App\Models\StockBatch;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckExpiredUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stock:check-expired-batches';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check expired stock batches and send WhatsApp notifications to users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking expired stock batches...');

        // Get batches expiring in 7 days for viewers
        $sevenDaysBatches = StockBatch::with(['warehouseStock.product', 'warehouseStock.warehouse'])
            ->where('is_active', true)
            ->whereDate('expired_at', '=', Carbon::now()->addDays(7)->toDateString())
            ->get();

        // Get batches expiring in 30 days for admin and super admin
        $thirtyDaysBatches = StockBatch::with(['warehouseStock.product', 'warehouseStock.warehouse'])
            ->where('is_active', true)
            ->whereDate('expired_at', '=', Carbon::now()->addDays(30)->toDateString())
            ->get();

        // Send notifications to viewers (7 days)
        if ($sevenDaysBatches->isNotEmpty()) {
            $this->sendNotificationsToViewers($sevenDaysBatches);
        }

        // Send notifications to admin and super admin (30 days)
        if ($thirtyDaysBatches->isNotEmpty()) {
            $this->sendNotificationsToAdmins($thirtyDaysBatches);
        }

        $this->info('Finished checking expired stock batches.');
        $this->info("Sent notifications for {$sevenDaysBatches->count()} batches (7 days) to viewers");
        $this->info("Sent notifications for {$thirtyDaysBatches->count()} batches (30 days) to admins");

        return Command::SUCCESS;
    }

    /**
     * Send notifications to viewers for batches expiring in 7 days
     */
    protected function sendNotificationsToViewers($batches): void
    {
        $channel = config('services.notification_channel', 'whatsapp');
        $recipientField = $channel === 'email' ? 'email' : 'phone_number';

        $viewers = User::role('viewer')
            ->whereNotNull($recipientField)
            ->get();

        foreach ($viewers as $viewer) {
            $recipient = $channel === 'email' ? $viewer->email : $viewer->phone_number;

            if ($channel === 'email') {
                // For email, send structured data for Mailable
                $mailableData = $this->buildEmailData($batches, $viewer->name, 7, 'warning');
                $mailableDataJson = json_encode([
                    'mailable' => 'ExpiredStockMail',
                    'data' => $mailableData,
                ]);
                $subject = 'Peringatan Stock Expired (7 Hari)';
                SendWaExpiredNotification::dispatch($recipient, '', $subject, $mailableDataJson);
            } else {
                // For WhatsApp, send plain text message
                $message = $this->buildWhatsAppMessage($batches, $viewer->name, 7);
                SendWaExpiredNotification::dispatch($recipient, $message);
            }
        }

        $this->info("Sent notifications to {$viewers->count()} viewers via {$channel}");
    }

    /**
     * Send notifications to admins for batches expiring in 30 days
     */
    protected function sendNotificationsToAdmins($batches): void
    {
        $channel = config('services.notification_channel', 'whatsapp');
        $recipientField = $channel === 'email' ? 'email' : 'phone_number';

        $admins = User::role(['admin', 'super-admin'])
            ->whereNotNull($recipientField)
            ->get();

        foreach ($admins as $admin) {
            $recipient = $channel === 'email' ? $admin->email : $admin->phone_number;

            if ($channel === 'email') {
                // For email, send structured data for Mailable
                $mailableData = $this->buildEmailData($batches, $admin->name, 30, 'info');
                $mailableDataJson = json_encode([
                    'mailable' => 'ExpiredStockMail',
                    'data' => $mailableData,
                ]);
                $subject = 'Peringatan Stock Expired (30 Hari)';
                SendWaExpiredNotification::dispatch($recipient, '', $subject, $mailableDataJson);
            } else {
                // For WhatsApp, send plain text message
                $message = $this->buildWhatsAppMessage($batches, $admin->name, 30);
                SendWaExpiredNotification::dispatch($recipient, $message);
            }
        }

        $this->info("Sent notifications to {$admins->count()} admins via {$channel}");
    }

    /**
     * Build email data for Mailable
     */
    protected function buildEmailData($batches, string $userName, int $days, string $alertType): array
    {
        $batchesData = [];
        foreach ($batches as $batch) {
            $product = $batch->warehouseStock->product;
            $warehouse = $batch->warehouseStock->warehouse;

            $batchesData[] = [
                'product_name' => $product->name,
                'batch_number' => $batch->batch_number,
                'sku' => $product->sku,
                'warehouse_name' => $warehouse->name,
                'current_qty' => $batch->current_qty,
                'expired_at' => Carbon::parse($batch->expired_at)->format('d/m/Y'),
            ];
        }

        return [
            'userName' => $userName,
            'days' => $days,
            'batches' => $batchesData,
            'alertType' => $alertType, // 'warning' for 7 days, 'info' for 30 days
        ];
    }

    /**
     * Build WhatsApp message (plain text)
     */
    protected function buildWhatsAppMessage($batches, string $userName, int $days): string
    {
        $message = "*PERINGATAN STOCK EXPIRED*\n\n";
        $message .= "Halo {$userName},\n\n";
        $message .= "Berikut adalah stock yang akan expired dalam *{$days} hari*:\n\n";

        foreach ($batches as $batch) {
            $product = $batch->warehouseStock->product;
            $warehouse = $batch->warehouseStock->warehouse;
            $expiredDate = Carbon::parse($batch->expired_at)->format('d/m/Y');

            $message .= "📦 *{$product->name}*\n";
            $message .= "   Batch: {$batch->batch_number}\n";
            $message .= "   SKU: {$product->sku}\n";
            $message .= "   Gudang: {$warehouse->name}\n";
            $message .= "   Qty: {$batch->current_qty}\n";
            $message .= "   Expired: {$expiredDate}\n\n";
        }

        $message .= "Mohon segera lakukan tindakan yang diperlukan.\n\n";
        $message .= '_Pesan otomatis dari sistem GudangKu_';

        return $message;
    }
}

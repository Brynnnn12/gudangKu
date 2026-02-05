<?php

namespace App\Console\Commands;

use App\Jobs\SendWaExpiredNotification;
use App\Models\StockBatch;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckExpiredUsers extends Command
{
    protected $signature = 'stock:check-expired-batches';

    protected $description = 'Cek stok kadaluwarsa dan kirim notifikasi via WhatsApp/Email';

    public function handle()
    {
        $this->info('Memulai pengecekan stok...');

        $batch7Hari = StockBatch::with(['warehouseStock.product', 'warehouseStock.warehouse'])
            ->where('is_active', true)
            ->whereDate('expired_at', '=', Carbon::now()->addDays(7)->toDateString())
            ->get();

        $batch30Hari = StockBatch::with(['warehouseStock.product', 'warehouseStock.warehouse'])
            ->where('is_active', true)
            ->whereDate('expired_at', '=', Carbon::now()->addDays(30)->toDateString())
            ->get();

        if ($batch7Hari->isNotEmpty()) {
            $this->kirimNotifikasi($batch7Hari, ['viewer'], 7, 'warning');
        }
        if ($batch30Hari->isNotEmpty()) {
            $this->kirimNotifikasi($batch30Hari, ['admin', 'super-admin'], 30, 'info');
        }

        $this->info('Pengecekan selesai.');

        return Command::SUCCESS;
    }

    protected function kirimNotifikasi($batches, array $roles, int $hari, string $tipeAlert): void
    {
        $channel = config('services.notification_channel', 'whatsapp');
        $field = $channel === 'email' ? 'email' : 'phone_number';
        $users = User::role($roles)->whereNotNull($field)->get();

        foreach ($users as $user) {
            if ($channel === 'email') {
                $data = $this->buatDataEmail($batches, $user->name, $hari, $tipeAlert);
                $json = json_encode(['mailable' => 'ExpiredStockMail', 'data' => $data]);
                SendWaExpiredNotification::dispatch($user->$field, '', "Peringatan Stok Expired ($hari Hari)", $json);
            } else {
                $pesan = $this->buatPesanWA($batches, $user->name, $hari);
                SendWaExpiredNotification::dispatch($user->$field, $pesan);
            }
        }
    }

    protected function buatDataEmail($batches, string $nama, int $hari, string $tipe): array
    {
        return [
            'userName' => $nama,
            'days' => $hari,
            'alertType' => $tipe,
            'batches' => $batches->map(fn ($b) => [
                'product_name' => $b->warehouseStock->product->name,
                'batch_number' => $b->batch_number,
                'sku' => $b->warehouseStock->product->sku,
                'warehouse_name' => $b->warehouseStock->warehouse->name,
                'current_qty' => $b->current_qty,
                'expired_at' => Carbon::parse($b->expired_at)->format('d/m/Y'),
            ])->toArray(),
        ];
    }

    protected function buatPesanWA($batches, string $nama, int $hari): string
    {
        $limit = 10;
        $total = $batches->count();
        $displayBatches = $batches->take($limit);

        $msg = "*PERINGATAN STOK KADALUWARSA*\n\n";
        $msg .= "Halo $nama,\n";
        $msg .= "Ada *$total* batch stok yang akan kadaluwarsa dlm *$hari hari*:\n\n";

        foreach ($displayBatches as $b) {
            $prod = $b->warehouseStock->product;
            $msg .= "📦 *{$prod->name}* ({$b->batch_number})\n";
            $msg .= '   Exp: '.Carbon::parse($b->expired_at)->format('d/m/Y')." | Qty: {$b->current_qty}\n\n";
        }

        if ($total > $limit) {
            $sisa = $total - $limit;
            $msg .= "...dan *$sisa* item lainnya.\n\n";
        }

        $msg .= "Mohon segera cek dashboard GudangKu.\n";
        $msg .= '_Pesan otomatis sistem_ ['.bin2hex(random_bytes(2)).']';

        return $msg;
    }
}

<?php

namespace App\Console\Commands;

use App\Services\FonteService;
use Illuminate\Console\Command;

class TestFonnte extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:fonnte {phone} {message=Test message from GudangKu}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Fonnte WhatsApp API';

    /**
     * Execute the console command.
     */
    public function handle(FonteService $fonteService)
    {
        $phone = $this->argument('phone');
        $message = $this->argument('message');

        $this->info("Sending test message to {$phone}...");
        $this->info("Message: {$message}");

        $result = $fonteService->sendMessage($phone, $message);

        $this->newLine();
        $this->line('Result:');
        $this->line(json_encode($result, JSON_PRETTY_PRINT));

        if ($result['success']) {
            $this->info('✓ Message sent successfully!');

            return Command::SUCCESS;
        }

        $this->error('✗ Failed to send message');
        $this->error('Error: '.($result['error'] ?? 'Unknown error'));

        // Give helpful hint for common errors
        if (isset($result['data']['reason'])) {
            $reason = $result['data']['reason'];
            $this->newLine();
            $this->warn('💡 Hints:');

            if (str_contains($reason, 'disconnected device')) {
                $this->line('  • Your WhatsApp device is disconnected from Fonnte');
                $this->line('  • Please login to https://fonnte.com and reconnect your device');
                $this->line('  • Steps: Dashboard → Connect Device → Scan QR with WhatsApp');
            } elseif (str_contains($reason, 'invalid')) {
                $this->line('  • Check if phone number format is correct (e.g., 6281234567890)');
                $this->line('  • Make sure number is registered on WhatsApp');
            }
        }

        return Command::FAILURE;
    }
}

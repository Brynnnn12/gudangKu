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
        } else {
            $this->error('✗ Failed to send message');
            $this->error('Error: ' . ($result['error'] ?? 'Unknown error'));
        }

        return $result['success'] ? Command::SUCCESS : Command::FAILURE;
    }
}

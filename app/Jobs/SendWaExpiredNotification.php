<?php

namespace App\Jobs;

use App\Services\FonteService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendWaExpiredNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public $backoff = [60, 180, 600];

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $phone,
        public string $message
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(FonteService $fonteService): void
    {
        try {
            $result = $fonteService->sendMessage($this->phone, $this->message);

            if (! $result['success']) {
                Log::warning('Failed to send WhatsApp notification', [
                    'phone' => $this->phone,
                    'error' => $result['error'] ?? 'Unknown error',
                ]);

                // Release the job back to queue for retry
                $this->release(60);
            }
        } catch (\Exception $e) {
            Log::error('Exception in SendWaExpiredNotification job', [
                'phone' => $this->phone,
                'error' => $e->getMessage(),
            ]);

            // Release the job back to queue for retry
            $this->release(60);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('SendWaExpiredNotification job failed permanently', [
            'phone' => $this->phone,
            'error' => $exception->getMessage(),
        ]);
    }
}

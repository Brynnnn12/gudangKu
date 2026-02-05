<?php

namespace App\Jobs;

use App\Contracts\NotificationServiceInterface;
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
        public string $recipient,
        public string $message,
        public ?string $subject = null,
        public ?string $mailableDataJson = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(NotificationServiceInterface $notificationService): void
    {
        try {
            // Add delay to prevent spam (3 seconds between messages)
            sleep(3);

            // Use mailableDataJson if provided, otherwise use regular message
            $message = $this->mailableDataJson ?? $this->message;

            $result = $notificationService->sendMessage(
                $this->recipient,
                $message,
                $this->subject
            );

            if (! $result['success']) {
                Log::warning('Failed to send expired notification', [
                    'recipient' => $this->recipient,
                    'error' => $result['error'] ?? 'Unknown error',
                ]);

                // Release the job back to queue for retry
                $this->release(60);
            }
        } catch (\Exception $e) {
            Log::error('Exception in SendWaExpiredNotification job', [
                'recipient' => $this->recipient,
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
            'recipient' => $this->recipient,
            'error' => $exception->getMessage(),
        ]);
    }
}

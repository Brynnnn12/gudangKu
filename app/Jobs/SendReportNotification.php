<?php

namespace App\Jobs;

use App\Contracts\NotificationServiceInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendReportNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public $backoff = [60, 180, 600];

    public function __construct(
        public string $recipient,
        public string $message,
        public ?string $subject = null,
        public ?string $mailableDataJson = null
    ) {}

    public function handle(NotificationServiceInterface $notificationService): void
    {
        try {
            sleep(3);

            $content = $this->mailableDataJson ?? $this->message;

            $result = $notificationService->sendMessage(
                $this->recipient,
                $content,
                $this->subject
            );

            if (! $result['success']) {
                $this->release(60);
            }
        } catch (\Exception $e) {
            $this->release(60);
        }
    }

    public function failed(\Throwable $exception): void
    {
        // Cleanup atau fail logic tanpa log
    }
}

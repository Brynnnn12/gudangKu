<?php

namespace App\Jobs;

use App\Contracts\NotificationServiceInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendWaExpiredNotification implements ShouldQueue
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
            sleep(rand(3, 7));

            $hour = now()->hour;
            if ($hour < 7 || $hour > 22) {
                $this->release(now()->addHours(2)); // Coba lagi 2 jam kemudian

                return;
            }

            $content = $this->mailableDataJson ?? $this->message;

            $result = $notificationService->sendMessage(
                $this->recipient,
                $content,
                $this->subject
            );

            if (! $result['success']) {
                $this->release(300);
            }
        } catch (\Exception $e) {
            $this->release(600);
        }
    }

    public function failed(\Throwable $exception): void
    {
        // Fail silently or handle permanent failure logic here
    }
}

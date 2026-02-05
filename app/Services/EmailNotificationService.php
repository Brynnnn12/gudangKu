<?php

namespace App\Services;

use App\Contracts\NotificationServiceInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailNotificationService implements NotificationServiceInterface
{
    /**
     * Send email notification
     *
     * @param  string  $recipient  Email address
     * @param  string  $message  Message content
     * @param  string|null  $subject  Email subject
     * @return array Response
     */
    public function sendMessage(string $recipient, string $message, ?string $subject = null): array
    {
        try {
            Mail::raw($message, function ($mail) use ($recipient, $subject) {
                $mail->to($recipient)
                    ->subject($subject ?? 'Notifikasi dari GudangKu');
            });

            Log::info('Email notification sent successfully', [
                'recipient' => $recipient,
                'subject' => $subject,
            ]);

            return [
                'success' => true,
                'data' => [
                    'status' => 'sent',
                    'recipient' => $recipient,
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Failed to send email notification', [
                'recipient' => $recipient,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Send bulk email notifications
     *
     * @param  array  $recipients  Array of recipients with recipient, message, and subject
     * @return array Results of bulk sending
     */
    public function sendBulkMessages(array $recipients): array
    {
        $results = [];

        foreach ($recipients as $item) {
            $results[] = $this->sendMessage(
                $item['recipient'] ?? $item['email'], // Support both keys
                $item['message'],
                $item['subject'] ?? null
            );

            // Add delay to prevent spam (3 seconds between emails)
            sleep(3);
        }

        return $results;
    }
}

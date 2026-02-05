<?php

namespace App\Services;

use App\Contracts\NotificationServiceInterface;
use App\Mail\ExpiredStockMail;
use App\Mail\StockReportMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailNotificationService implements NotificationServiceInterface
{
    /**
     * Send email notification
     *
     * @param  string  $recipient  Email address
     * @param  string  $message  Message content or JSON data
     * @param  string|null  $subject  Email subject
     * @return array Response
     */
    public function sendMessage(string $recipient, string $message, ?string $subject = null): array
    {
        try {
            $data = json_decode($message, true);

            if (json_last_error() === JSON_ERROR_NONE && isset($data['mailable'])) {
                $mailableClass = $data['mailable'];
                $mailableData = $data['data'];

                switch ($mailableClass) {
                    case 'StockReportMail':
                        Mail::to($recipient)->send(new StockReportMail(
                            $mailableData['period'],
                            $mailableData['dateRange'],
                            $mailableData['totalCosts'],
                            $mailableData['totalRevenue'],
                            $mailableData['profit'],
                            $mailableData['stockIn'],
                            $mailableData['stockOut'],
                            $mailableData['warehouses'],
                            $mailableData['totalItems'],
                            $mailableData['totalQty']
                        ));
                        break;
                    case 'ExpiredStockMail':
                        Mail::to($recipient)->send(new ExpiredStockMail(
                            $mailableData['userName'],
                            $mailableData['days'],
                            $mailableData['batches'],
                            $mailableData['alertType']
                        ));
                        break;
                    default:
                        // Fallback to plain text
                        Mail::raw($message, function ($mail) use ($recipient, $subject) {
                            $mail->to($recipient)
                                ->subject($subject ?? 'Notifikasi dari GudangKu');
                        });
                }
            } else {
                // Send plain text email
                Mail::raw($message, function ($mail) use ($recipient, $subject) {
                    $mail->to($recipient)
                        ->subject($subject ?? 'Notifikasi dari GudangKu');
                });
            }

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

            sleep(3);
        }

        return $results;
    }
}

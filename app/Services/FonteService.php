<?php

namespace App\Services;

use App\Contracts\NotificationServiceInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonteService implements NotificationServiceInterface
{
    protected string $apiUrl;

    protected string $token;

    public function __construct()
    {
        $this->apiUrl = 'https://api.fonnte.com';
        $this->token = config('services.fonnte.token');
    }

    /**
     * Send WhatsApp message
     *
     * @param  string  $recipient  Phone number in international format (e.g., 6281234567890)
     * @param  string  $message  Message content
     * @param  string|null  $subject  Optional subject (not used for WhatsApp)
     * @return array Response from Fonnte API
     */
    public function sendMessage(string $recipient, string $message, ?string $subject = null): array
    {
        // Check if Fonnte is enabled
        if (! config('services.fonnte.enabled', true)) {
            Log::info('Fonnte notifications are disabled', [
                'recipient' => $recipient,
            ]);

            return [
                'success' => true,
                'data' => ['status' => 'disabled', 'message' => 'Notifications are disabled'],
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token,
            ])->post("{$this->apiUrl}/send", [
                'target' => $recipient,
                'message' => $message,
                'countryCode' => '62', // Indonesia country code
            ]);

            if ($response->successful()) {
                $responseData = $response->json();

                // Check if Fonnte actually sent the message
                $isSent = isset($responseData['status']) ? $responseData['status'] : true;

                if ($isSent) {
                    Log::info('WhatsApp message sent successfully', [
                        'recipient' => $recipient,
                        'response' => $responseData,
                    ]);

                    return [
                        'success' => true,
                        'data' => $responseData,
                    ];
                }

                // Fonnte returned error (e.g., disconnected device)
                Log::warning('Fonnte API returned error', [
                    'recipient' => $recipient,
                    'response' => $responseData,
                ]);

                return [
                    'success' => false,
                    'error' => $responseData['reason'] ?? 'Unknown error from Fonnte',
                    'data' => $responseData,
                ];
            }

            Log::error('Failed to send WhatsApp message', [
                'recipient' => $recipient,
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            return [
                'success' => false,
                'error' => $response->body(),
            ];
        } catch (\Exception $e) {
            Log::error('Exception when sending WhatsApp message', [
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
     * Send bulk WhatsApp messages
     *
     * @param  array  $recipients  Array of recipients with recipient, message, and optional subject
     * @return array Results of bulk sending
     */
    public function sendBulkMessages(array $recipients): array
    {
        $results = [];

        foreach ($recipients as $item) {
            $results[] = $this->sendMessage(
                $item['recipient'] ?? $item['phone'], // Support both keys for backward compatibility
                $item['message'],
                $item['subject'] ?? null
            );
        }

        return $results;
    }
}

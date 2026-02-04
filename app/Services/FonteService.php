<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonteService
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
     * @param  string  $phone  Phone number in international format (e.g., 6281234567890)
     * @param  string  $message  Message content
     * @return array Response from Fonnte API
     */
    public function sendMessage(string $phone, string $message): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token,
            ])->post("{$this->apiUrl}/send", [
                'target' => $phone,
                'message' => $message,
                'countryCode' => '62', // Indonesia country code
            ]);

            if ($response->successful()) {
                Log::info('WhatsApp message sent successfully', [
                    'phone' => $phone,
                    'response' => $response->json(),
                ]);

                return [
                    'success' => true,
                    'data' => $response->json(),
                ];
            }

            Log::error('Failed to send WhatsApp message', [
                'phone' => $phone,
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            return [
                'success' => false,
                'error' => $response->body(),
            ];
        } catch (\Exception $e) {
            Log::error('Exception when sending WhatsApp message', [
                'phone' => $phone,
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
     * @param  array  $recipients  Array of recipients with phone and message
     * @return array Results of bulk sending
     */
    public function sendBulkMessages(array $recipients): array
    {
        $results = [];

        foreach ($recipients as $recipient) {
            $results[] = $this->sendMessage(
                $recipient['phone'],
                $recipient['message']
            );
        }

        return $results;
    }
}

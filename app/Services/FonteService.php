<?php

namespace App\Services;

use App\Contracts\NotificationServiceInterface;
use Illuminate\Support\Facades\Http;

class FonteService implements NotificationServiceInterface
{
    protected string $apiUrl = 'https://api.fonnte.com';
    protected string $token;

    public function __construct()
    {
        $this->token = config('services.fonnte.token');
    }

    public function sendMessage(string $recipient, string $message, ?string $subject = null): array
    {
        if (!config('services.fonnte.enabled', true)) {
            return ['success' => true, 'message' => 'disabled'];
        }

        try {
            $response = Http::withHeaders(['Authorization' => $this->token])
                ->post("{$this->apiUrl}/send", [
                    'target' => $recipient,
                    'message' => $this->randomizeMessage($message),
                    'countryCode' => '62',
                    'delay' => '3-10',
                ]);

            $res = $response->json();
            return ['success' => $res['status'] ?? false, 'data' => $res];
        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    public function sendBulkMessages(array $recipients): array
    {
        $results = [];
        foreach ($recipients as $item) {
            $results[] = $this->sendMessage(
                $item['recipient'] ?? $item['phone'],
                $item['message']
            );

            sleep(rand(5, 15));
        }
        return $results;
    }

    private function randomizeMessage(string $message): string
    {
        $greetings = ["Halo", "Hi", "Selamat", "Info"];
        $prefix = $greetings[array_rand($greetings)];
        return "[$prefix] " . $message . "\n" . bin2hex(random_bytes(2));
    }
}

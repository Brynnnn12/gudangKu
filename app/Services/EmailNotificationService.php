<?php

namespace App\Services;

use App\Contracts\NotificationServiceInterface;
use Illuminate\Support\Facades\Mail;

class EmailNotificationService implements NotificationServiceInterface
{
    public function sendMessage(string $recipient, string $message, ?string $subject = null): array
    {
        try {
            $data = json_decode($message, true);

            if (json_last_error() === JSON_ERROR_NONE && isset($data['mailable'])) {
                $this->sendMailable($recipient, $data['mailable'], $data['data']);
            } else {
                $this->sendPlainEmail($recipient, $message, $subject);
            }

            return [
                'success' => true,
                'data' => [
                    'status' => 'sent',
                    'recipient' => $recipient,
                ],
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    public function sendBulkMessages(array $recipients): array
    {
        $results = [];

        foreach ($recipients as $item) {
            $results[] = $this->sendMessage(
                $item['recipient'] ?? $item['email'],
                $item['message'],
                $item['subject'] ?? null
            );

            sleep(3);
        }

        return $results;
    }

    protected function sendMailable(string $recipient, string $mailableClass, array $data): void
    {
        $fullClassName = "App\\Mail\\{$mailableClass}";

        if (! class_exists($fullClassName)) {
            throw new \InvalidArgumentException("Mailable class {$fullClassName} not found");
        }

        $reflection = new \ReflectionClass($fullClassName);
        $constructor = $reflection->getConstructor();

        if ($constructor) {
            $parameters = $constructor->getParameters();
            $args = [];

            foreach ($parameters as $param) {
                $paramName = $param->getName();
                $args[] = $data[$paramName] ?? ($param->isDefaultValueAvailable() ? $param->getDefaultValue() : null);
            }

            $mailable = $reflection->newInstanceArgs($args);
        } else {
            $mailable = new $fullClassName;
        }

        Mail::to($recipient)->send($mailable);
    }

    protected function sendPlainEmail(string $recipient, string $message, ?string $subject): void
    {
        Mail::raw($message, function ($mail) use ($recipient, $subject) {
            $mail->to($recipient)->subject($subject ?? 'Notifikasi dari GudangKu');
        });
    }
}

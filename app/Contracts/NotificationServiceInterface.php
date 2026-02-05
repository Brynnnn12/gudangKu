<?php

namespace App\Contracts;

interface NotificationServiceInterface
{
    public function sendMessage(string $recipient, string $message, ?string $subject = null): array;

    public function sendBulkMessages(array $recipients): array;
}

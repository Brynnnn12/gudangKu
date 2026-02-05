<?php

namespace App\Contracts;

interface NotificationServiceInterface
{
    /**
     * Send notification message
     *
     * @param  string  $recipient  Recipient identifier (phone number or email)
     * @param  string  $message  Message content
     * @param  string|null  $subject  Optional subject (for email)
     * @return array Response with success status and data
     */
    public function sendMessage(string $recipient, string $message, ?string $subject = null): array;

    /**
     * Send bulk notification messages
     *
     * @param  array  $recipients  Array of recipients with recipient, message, and optional subject
     * @return array Results of bulk sending
     */
    public function sendBulkMessages(array $recipients): array;
}

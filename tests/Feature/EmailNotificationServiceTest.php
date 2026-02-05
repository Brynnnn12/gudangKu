<?php

use App\Mail\ExpiredStockMail;
use App\Mail\StockReportMail;
use App\Services\EmailNotificationService;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
    $this->service = app(EmailNotificationService::class);
});

test('sends plain email successfully', function () {
    $result = $this->service->sendMessage(
        'test@example.com',
        'Test message',
        'Test Subject'
    );

    expect($result['success'])->toBeTrue();
    expect($result['data']['status'])->toBe('sent');
    expect($result['data']['recipient'])->toBe('test@example.com');
});

test('sends stock report mailable dynamically', function () {
    $mailableData = [
        'period' => 'weekly',
        'dateRange' => '01/01/2026 - 07/01/2026',
        'totalCosts' => 1000000.0,
        'totalRevenue' => 1500000.0,
        'profit' => 500000.0,
        'stockIn' => 100,
        'stockOut' => 50,
        'warehouses' => [['name' => 'Gudang A', 'items' => 10, 'qty' => 100]],
        'totalItems' => 10,
        'totalQty' => 100,
    ];

    $message = json_encode([
        'mailable' => 'StockReportMail',
        'data' => $mailableData,
    ]);

    $result = $this->service->sendMessage('test@example.com', $message);

    expect($result['success'])->toBeTrue();
    Mail::assertSent(StockReportMail::class);
});

test('sends expired stock mailable dynamically', function () {
    $mailableData = [
        'userName' => 'John Doe',
        'days' => 30,
        'batches' => [['product' => 'Product A', 'batch' => 'B001', 'qty' => 10]],
        'alertType' => 'warning',
    ];

    $message = json_encode([
        'mailable' => 'ExpiredStockMail',
        'data' => $mailableData,
    ]);

    $result = $this->service->sendMessage('test@example.com', $message);

    expect($result['success'])->toBeTrue();
    Mail::assertSent(ExpiredStockMail::class);
});

test('handles invalid mailable class gracefully', function () {
    $message = json_encode([
        'mailable' => 'NonExistentMail',
        'data' => [],
    ]);

    $result = $this->service->sendMessage('test@example.com', $message);

    expect($result['success'])->toBeFalse();
    expect($result['error'])->toContain('not found');
});

test('sends bulk messages successfully', function () {
    $recipients = [
        ['email' => 'user1@example.com', 'message' => 'Message 1', 'subject' => 'Subject 1'],
        ['recipient' => 'user2@example.com', 'message' => 'Message 2'],
    ];

    $results = $this->service->sendBulkMessages($recipients);

    expect($results)->toHaveCount(2);
    expect($results[0]['success'])->toBeTrue();
    expect($results[1]['success'])->toBeTrue();
});

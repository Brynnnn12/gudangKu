<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Check expired batches daily
Schedule::command('stock:check-expired-batches')->daily();

// Send weekly stock report every Monday at 8 AM
Schedule::command('report:send-stock weekly')->weeklyOn(1, '08:00');

// Send monthly stock report on the 1st day of each month at 8 AM
Schedule::command('report:send-stock monthly')->monthlyOn(1, '08:00');

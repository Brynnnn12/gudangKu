<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('stock:check-expired-batches')
    ->daily()
    ->withoutOverlapping()
    ->runInBackground()
    ->onOneServer();

Schedule::command('report:send-stock weekly')
    ->weeklyOn(1, '08:00')
    ->withoutOverlapping()
    ->runInBackground()
    ->onOneServer();

Schedule::command('report:send-stock monthly')
    ->monthlyOn(1, '08:00')
    ->withoutOverlapping()
    ->runInBackground()
    ->onOneServer();

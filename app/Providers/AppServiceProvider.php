<?php

namespace App\Providers;

use App\Contracts\NotificationServiceInterface;
use App\Services\EmailNotificationService;
use App\Services\FonteService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind NotificationServiceInterface based on config
        $this->app->bind(NotificationServiceInterface::class, function ($app) {
            $channel = config('services.notification_channel', 'whatsapp');

            return match ($channel) {
                'email' => $app->make(EmailNotificationService::class),
                'whatsapp' => $app->make(FonteService::class),
                default => $app->make(FonteService::class),
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}

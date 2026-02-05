<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Mail\ResetPasswordMail;
use App\Mail\VerifyEmailMail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
        $this->configureEmailNotifications();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register'));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        // Two-factor authentication: 3 attempts per minute
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(3)
                ->by($request->session()->get('login.id'))
                ->response(function (Request $request, array $headers) {
                    return response('Terlalu banyak percobaan. Silakan coba lagi dalam 1 menit.', 429, $headers);
                });
        });

        // Login attempts: 3 per minute, 10 per hour
        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return [
                Limit::perMinute(3)->by($throttleKey)->response(function (Request $request, array $headers) {
                    return response('Terlalu banyak percobaan login. Silakan coba lagi dalam 1 menit.', 429, $headers);
                }),
                Limit::perHour(10)->by($throttleKey)->response(function (Request $request, array $headers) {
                    return response('Akun Anda telah dikunci sementara. Silakan coba lagi dalam 1 jam.', 429, $headers);
                }),
            ];
        });

        // Password reset: 3 per 10 minutes
        RateLimiter::for('password-reset', function (Request $request) {
            return Limit::perMinutes(10, 3)
                ->by($request->input('email').'|'.$request->ip())
                ->response(function (Request $request, array $headers) {
                    return response('Terlalu banyak permintaan reset password. Silakan coba lagi dalam 10 menit.', 429, $headers);
                });
        });
    }

    /**
     * Configure custom email notifications.
     */
    private function configureEmailNotifications(): void
    {
        // Custom email verification
        VerifyEmail::toMailUsing(function ($notifiable, $url) {
            Mail::to($notifiable->email)->send(new VerifyEmailMail(
                $notifiable->name,
                $url
            ));
        });

        // Custom reset password
        ResetPassword::toMailUsing(function ($notifiable, $token) {
            $url = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            Mail::to($notifiable->email)->send(new ResetPasswordMail(
                $notifiable->name,
                $url
            ));
        });
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeadersMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevent Clickjacking attacks
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Enable XSS protection in older browsers
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer Policy - only send origin on cross-origin requests
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Force HTTPS if in production
        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // Permissions Policy - restrict browser features
        $response->headers->set('Permissions-Policy', implode(', ', [
            'camera=()',
            'microphone=()',
            'geolocation=()',
            'interest-cohort=()',
            'payment=()',
        ]));

        // Content Security Policy - Allow Inertia and Vite assets
        $cspDirectives = $this->getContentSecurityPolicy();

        $response->headers->set('Content-Security-Policy', implode('; ', $cspDirectives));

        return $response;
    }

    private function getContentSecurityPolicy(): array
    {
        $isDevelopment = app()->environment('local', 'development');

        // Tambahkan domain Google ke script dan connect
        $scriptSrc = ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com"];
        $styleSrc = ["'self'", "'unsafe-inline'", "https://fonts.bunny.net"];
        $fontSrc = ["'self'", 'data:', "https://fonts.bunny.net"];
        $connectSrc = ["'self'", "https://accounts.google.com", "https://oauth2.googleapis.com"];

        // Penting: Izinkan foto profil Google tampil
        $imgSrc = ["'self'", "data:", "https://lh3.googleusercontent.com", "https://*.googleusercontent.com"];

        if ($isDevelopment) {
            $viteUrls = ['http://127.0.0.1:5173', 'http://localhost:5173'];
            $viteWs = ['ws://127.0.0.1:5173', 'ws://localhost:5173'];

            $scriptSrc = array_merge($scriptSrc, $viteUrls);
            $styleSrc = array_merge($styleSrc, $viteUrls);
            $connectSrc = array_merge($connectSrc, $viteUrls, $viteWs);
        }

        // Perbaikan kritis: navigasi keluar ke Google harus diizinkan di form-action
        return array(
            "default-src 'self'",
            'script-src ' . implode(' ', $scriptSrc),
            'style-src ' . implode(' ', $styleSrc),
            'img-src ' . implode(' ', $imgSrc),
            'font-src ' . implode(' ', $fontSrc),
            'connect-src ' . implode(' ', $connectSrc),
            "frame-src 'self' https://accounts.google.com",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self' https://accounts.google.com https://*.google.com"
        );
    }
}

<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Socialite;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function google_redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function google_callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Cari user yang sudah didaftarkan manual oleh Admin di database
            $user = User::where('email', $googleUser->email)->first();

            // JIKA USER TIDAK DITEMUKAN (Artinya emailnya belum didaftarkan Admin)
            if (! $user) {
                return redirect()->route('login')
                    ->with('error', 'Email Anda tidak terdaftar di sistem. Silakan hubungi Admin.');
            }

            // Update data google jika user sudah terdaftar
            $user->update([
                'google_id' => $googleUser->id,
                'google_token' => $googleUser->token,
                'email_verified_at' => now(),
            ]);

            Auth::login($user);

            return redirect()->route('dashboard.index');
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Gagal login.');
        }
    }
}

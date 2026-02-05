<?php

use App\Models\User;

test('sends verification notification', function () {
    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)
        ->post(route('verification.send'));

    $response->assertRedirect('/');
    $response->assertSessionHas('status', 'verification-link-sent');
});

test('does not send verification notification if email is verified', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('verification.send'));

    $response->assertRedirect(route('dashboard', absolute: false));
    $response->assertSessionMissing('status');
});

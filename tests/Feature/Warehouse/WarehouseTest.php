<?php

use function Pest\Laravel\actingAs;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;

test('super-admin bisa melihat daftar gudang', function () {
    $superAdmin = createSuperAdmin();

    $warehouses = \App\Models\Warehouse::factory()->count(3)->create();

    $response = actingAs($superAdmin)->get(route('warehouses.index'));

    $response->assertOk()
        ->assertInertia(
            fn($page) => $page
                ->component('warehouses/index')
                ->has('warehouses.data', 3)
                ->has(
                    'warehouses.data.0',
                    fn($warehouse) => $warehouse
                        ->has('id')
                        ->has('name')
                        ->has('address')
                        ->has('created_at')
                        ->has('updated_at')
                        ->has('deleted_at')
                )
        );
});

test('admin bisa melihat daftar gudang', function () {
    $admin = createAdmin();
    \App\Models\Warehouse::factory()->count(2)->create();

    $response = actingAs($admin)->get(route('warehouses.index'));

    $response->assertOk()
        ->assertInertia(
            fn($page) => $page
                ->component('warehouses/index')
                ->has('warehouses.data', 2)
        );
});

test('viewer bisa melihat daftar gudang', function () {
    $viewer = createViewer();
    \App\Models\Warehouse::factory()->count(2)->create();

    $response = actingAs($viewer)->get(route('warehouses.index'));

    $response->assertOk()
        ->assertInertia(
            fn($page) => $page
                ->component('warehouses/index')
                ->has('warehouses.data', 2)
        );
});


test('user tanpa peran tidak bisa melihat daftar gudang', function () {
    $user = \App\Models\User::factory()->create();
    \App\Models\Warehouse::factory()->count(2)->create();

    $response = actingAs($user)->get(route('warehouses.index'));

    $response->assertForbidden();
});


test('super-admin bisa buat gudang', function () {
    $superAdmin = createSuperAdmin();

    $response = actingAs($superAdmin)->post(route('warehouses.store'), [
        'name' => 'Gudang Baru',
        'address' => 'Jl. Contoh Alamat No.123',
    ]);

    $response->assertRedirect(route('warehouses.index'))
        ->assertSessionHas('success', 'Gudang berhasil dibuat.');

    // vertifikasi data name dan address tersimpan di database pakai except
    expect(\App\Models\Warehouse::where('name', 'Gudang Baru')
        ->where('address', 'Jl. Contoh Alamat No.123')
        ->exists())->toBeTrue();

});

test('admin tidak bisa buat gudang', function () {
    $admin = createAdmin();

    $response = actingAs($admin)->post(route('warehouses.store'), [
        'name' => 'Gudang Admin',
        'address' => 'Jl. Admin Alamat No.456',
    ]);

    $response->assertForbidden();
});

test('viewer tidak bisa buat gudang', function () {
    $viewer = createViewer();

    $response = actingAs($viewer)->post(route('warehouses.store'), [
        'name' => 'Gudang Viewer',
        'address' => 'Jl. Viewer Alamat No.789',
    ]);

    $response->assertForbidden();
});

test('super-admin bisa update gudang', function () {
    $superAdmin = createSuperAdmin();
    $warehouse = \App\Models\Warehouse::factory()->create();

    $updateData = [
        'name' => 'Gudang Updated',
        'address' => 'Jl. Updated Alamat No.999',
    ];

    $response = actingAs($superAdmin)->put(route('warehouses.update', $warehouse), $updateData);

    $response->assertRedirect(route('warehouses.index'))
        ->assertSessionHas('success', 'Gudang berhasil diperbarui   .');

    // Verifikasi gudang terupdate di database
    $warehouse->refresh();
    expect($warehouse->name)->toBe('Gudang Updated');
    expect($warehouse->address)->toBe('Jl. Updated Alamat No.999');
});

test('super-admin bisa hapus gudang', function () {
    $superAdmin = createSuperAdmin();
    $warehouse = \App\Models\Warehouse::factory()->create();

    $response = actingAs($superAdmin)->delete(route('warehouses.destroy', $warehouse));

    $response->assertRedirect(route('warehouses.index'))
        ->assertSessionHas('success', 'Gudang berhasil dihapus.');

    // Verifikasi gudang terhapus (soft delete)
    expect(\App\Models\Warehouse::find($warehouse->id))->toBeNull();
    expect(\App\Models\Warehouse::withTrashed()->find($warehouse->id))->not->toBeNull();
});

test('admin tidak bisa update gudang', function () {
    $admin = createAdmin();
    $warehouse = \App\Models\Warehouse::factory()->create();

    $updateData = [
        'name' => 'Gudang Updated by Admin',
        'address' => 'Jl. Admin Update No.111',
    ];

    $response = actingAs($admin)->put(route('warehouses.update', $warehouse), $updateData);

    $response->assertForbidden();
});

test('viewer tidak bisa update gudang', function () {
    $viewer = createViewer();
    $warehouse = \App\Models\Warehouse::factory()->create();

    $updateData = [
        'name' => 'Gudang Updated by Viewer',
        'address' => 'Jl. Viewer Update No.222',
    ];

    $response = actingAs($viewer)->put(route('warehouses.update', $warehouse), $updateData);

    $response->assertForbidden();
});

test('admin tidak bisa hapus gudang', function () {
    $admin = createAdmin();
    $warehouse = \App\Models\Warehouse::factory()->create();

    $response = actingAs($admin)->delete(route('warehouses.destroy', $warehouse));

    $response->assertForbidden();
});

test('viewer tidak bisa hapus gudang', function () {
    $viewer = createViewer();
    $warehouse = \App\Models\Warehouse::factory()->create();

    $response = actingAs($viewer)->delete(route('warehouses.destroy', $warehouse));

    $response->assertForbidden();
});

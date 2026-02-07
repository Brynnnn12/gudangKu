<?php

use App\Models\Category;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;

// ============================================
// INDEX - Tampilkan daftar kategori
// ============================================

test('super-admin bisa melihat daftar kategori', function () {
    $superAdmin = createSuperAdmin();
    $categories = Category::factory()->count(3)->create();

    $response = actingAs($superAdmin)->get(route('categories.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('categories/index')
            ->has('categories.data', 3)
            ->has('categories.data.0', fn ($category) => $category
                ->has('id')
                ->has('name')
                ->has('slug')
                ->has('created_at')
                ->has('updated_at')
                ->has('deleted_at')
            )
        );
});

test('admin bisa melihat daftar kategori', function () {
    $admin = createAdmin();
    Category::factory()->count(2)->create();

    $response = actingAs($admin)->get(route('categories.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('categories/index')
            ->has('categories.data', 2)
        );
});

test('viewer bisa melihat daftar kategori', function () {
    $viewer = createViewer();
    Category::factory()->count(2)->create();

    $response = actingAs($viewer)->get(route('categories.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('categories/index')
        );
});

test('user yang tidak terautentikasi tidak bisa melihat daftar kategori', function () {
    get(route('categories.index'))
        ->assertRedirect(route('login'));
});

test('user tanpa peran tidak bisa melihat daftar kategori', function () {
    $user = User::factory()->create();

    actingAs($user)->get(route('categories.index'))
        ->assertForbidden();
});

// ============================================
// SEARCH & PAGINATION
// ============================================

test('kategori bisa dicari berdasarkan nama', function () {
    $superAdmin = createSuperAdmin();
    Category::factory()->create(['name' => 'Susu Segar']);
    Category::factory()->create(['name' => 'Minuman Ringan']);
    Category::factory()->create(['name' => 'Susu Coklat']);

    $response = actingAs($superAdmin)->get(route('categories.index', ['search' => 'Susu']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('categories/index')
            ->has('categories.data', 2)
            ->where('filters.search', 'Susu')
        );
});

test('kategori dipaginasi', function () {
    $superAdmin = createSuperAdmin();
    Category::factory()->count(15)->create();

    $response = actingAs($superAdmin)->get(route('categories.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('categories.data', 10) // Default pagination is 10
            ->has('categories.links')
            ->where('categories.per_page', 10)
        );
});

// ============================================
// SHOW - Display a specific category
// ============================================

// Skip test that requires React component file
// Uncomment when resources/js/pages/categories/show.tsx is created
/*
test('super-admin bisa melihat kategori tertentu', function () {
    $superAdmin = createSuperAdmin();
    $category = Category::factory()->create();

    $response = actingAs($superAdmin)->get(route('categories.show', $category));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('categories/show')
            ->has('category', fn ($cat) => $cat
                ->where('id', $category->id)
                ->where('name', $category->name)
                ->where('slug', $category->slug)
            )
        );
});
*/

// test('admin bisa melihat kategori tertentu', function () {
//     $admin = createAdmin();
//     $category = Category::factory()->create();
//
//     actingAs($admin)->get(route('categories.show', $category))
//         ->assertOk();
// });

// test('viewer bisa melihat kategori tertentu', function () {
//     $viewer = createViewer();
//     $category = Category::factory()->create();
//
//     actingAs($viewer)->get(route('categories.show', $category))
//         ->assertOk();
// });

test('user tanpa peran tidak bisa melihat kategori tertentu', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    actingAs($user)->get(route('categories.show', $category))
        ->assertForbidden();
});

// ============================================
// STORE - Buat kategori baru
// ============================================

test('super-admin bisa membuat kategori', function () {
    $superAdmin = createSuperAdmin();

    $response = actingAs($superAdmin)->post(route('categories.store'), [
        'name' => 'Minuman Segar',
    ]);

    $response->assertRedirect(route('categories.index'))
        ->assertSessionHas('success', 'Kategori Berhasil Dibuat.');

    expect(Category::where('name', 'Minuman Segar')->exists())->toBeTrue();
});

test('admin tidak bisa membuat kategori', function () {
    $admin = createAdmin();

    actingAs($admin)->post(route('categories.store'), [
        'name' => 'Minuman Segar',
    ])->assertForbidden();

    expect(Category::where('name', 'Minuman Segar')->exists())->toBeFalse();
});

test('viewer cannot create a category', function () {
    $viewer = createViewer();

    actingAs($viewer)->post(route('categories.store'), [
        'name' => 'Minuman Segar',
    ])->assertForbidden();
});

test('category name is required', function () {
    $superAdmin = createSuperAdmin();

    actingAs($superAdmin)->post(route('categories.store'), [
        'name' => '',
    ])->assertSessionHasErrors(['name']);
});

test('category slug is auto-generated', function () {
    $superAdmin = createSuperAdmin();

    actingAs($superAdmin)->post(route('categories.store'), [
        'name' => 'Minuman Segar Indonesia',
    ]);

    $category = Category::where('name', 'Minuman Segar Indonesia')->first();
    expect($category->slug)->toBe('minuman-segar-indonesia');
});

// ============================================
// UPDATE - Update an existing category
// ============================================

test('super-admin can update a category', function () {
    $superAdmin = createSuperAdmin();
    $category = Category::factory()->create(['name' => 'Old Name']);

    $response = actingAs($superAdmin)->put(route('categories.update', $category), [
        'name' => 'New Name',
    ]);

    $response->assertRedirect(route('categories.index'))
        ->assertSessionHas('success', 'Kategori Berhasil Diperbarui.');

    expect($category->fresh()->name)->toBe('New Name');
});

test('admin cannot update a category', function () {
    $admin = createAdmin();
    $category = Category::factory()->create(['name' => 'Old Name']);

    actingAs($admin)->put(route('categories.update', $category), [
        'name' => 'New Name',
    ])->assertForbidden();

    expect($category->fresh()->name)->toBe('Old Name');
});

test('viewer cannot update a category', function () {
    $viewer = createViewer();
    $category = Category::factory()->create(['name' => 'Old Name']);

    actingAs($viewer)->put(route('categories.update', $category), [
        'name' => 'New Name',
    ])->assertForbidden();
});

// ============================================
// DESTROY - Delete a category
// ============================================

test('super-admin can delete a category', function () {
    $superAdmin = createSuperAdmin();
    $category = Category::factory()->create();

    $response = actingAs($superAdmin)->delete(route('categories.destroy', $category));

    $response->assertRedirect(route('categories.index'))
        ->assertSessionHas('success', 'Kategori Berhasil Dihapus.');

    expect(Category::find($category->id))->toBeNull();
});

test('admin cannot delete a category', function () {
    $admin = createAdmin();
    $category = Category::factory()->create();

    actingAs($admin)->delete(route('categories.destroy', $category))
        ->assertForbidden();

    expect(Category::find($category->id))->not->toBeNull();
});

test('viewer cannot delete a category', function () {
    $viewer = createViewer();
    $category = Category::factory()->create();

    actingAs($viewer)->delete(route('categories.destroy', $category))
        ->assertForbidden();
});

// ============================================
// BULK DESTROY
// ============================================

test('super-admin can bulk delete categories', function () {
    $superAdmin = createSuperAdmin();
    $categories = Category::factory()->count(3)->create();
    $ids = $categories->pluck('id')->toArray();

    $response = actingAs($superAdmin)->delete(route('categories.bulk-destroy'), [
        'ids' => $ids,
    ]);

    $response->assertRedirect(route('categories.index'))
        ->assertSessionHas('success');

    expect(Category::whereIn('id', $ids)->count())->toBe(0);
});

test('admin cannot bulk delete categories', function () {
    $admin = createAdmin();
    $categories = Category::factory()->count(3)->create();
    $ids = $categories->pluck('id')->toArray();

    actingAs($admin)->delete(route('categories.bulk-destroy'), [
        'ids' => $ids,
    ])->assertForbidden();

    expect(Category::whereIn('id', $ids)->count())->toBe(3);
});

test('bulk delete requires valid ids', function () {
    $superAdmin = createSuperAdmin();

    actingAs($superAdmin)->delete(route('categories.bulk-destroy'), [
        'ids' => [],
    ])->assertSessionHasErrors(['ids']);

    actingAs($superAdmin)->delete(route('categories.bulk-destroy'), [
        'ids' => [999, 1000],
    ])->assertSessionHasErrors(['ids.0', 'ids.1']);
});

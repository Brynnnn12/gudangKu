<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('batch_id')->nullable()->constrained('stock_batches')->onDelete('set null');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('qty'); // (+) masuk, (-) keluar
            $table->enum('type', ['entry', 'exit', 'transfer', 'adjustment', 'damage']);
            $table->text('notes')->nullable();
            $table->timestamps();

            // ⚠️ NO softDeletes() - audit trail harus permanen
            $table->index(['warehouse_id', 'product_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
            $table->index(['type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_logs');
    }
};

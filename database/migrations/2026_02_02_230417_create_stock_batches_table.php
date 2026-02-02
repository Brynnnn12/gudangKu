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
        Schema::create('stock_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_stock_id')->constrained('warehouse_stocks')->cascadeOnDelete();
            $table->string('batch_number')->index();
            $table->date('expired_at')->nullable()->index();
            $table->integer('current_qty')->default(0);
            $table->decimal('cost_price', 15, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->enum('status', ['available', 'expired', 'warning'])->default('available')->index();
            $table->timestamps();

            // Indexes for FEFO queries
            $table->index(['warehouse_stock_id', 'expired_at', 'is_active']);
            $table->index(['warehouse_stock_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_batches');
    }
};

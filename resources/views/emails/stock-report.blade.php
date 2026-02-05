<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Stock {{ $period === 'weekly' ? 'Mingguan' : 'Bulanan' }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .card {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .card h2 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .metric:last-child {
            border-bottom: none;
        }
        .metric-label {
            color: #64748b;
            font-size: 14px;
        }
        .metric-value {
            font-weight: 600;
            font-size: 16px;
            color: #1e293b;
        }
        .profit-positive {
            color: #10b981;
        }
        .profit-negative {
            color: #ef4444;
        }
        .highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
        }
        .highlight-value {
            font-size: 32px;
            font-weight: 700;
            margin: 10px 0;
        }
        .highlight-label {
            font-size: 14px;
            opacity: 0.9;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            color: #64748b;
            font-size: 12px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .warehouse-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .warehouse-item:last-child {
            border-bottom: none;
        }
        .warehouse-name {
            font-weight: 500;
            color: #1e293b;
        }
        .warehouse-stats {
            color: #64748b;
            font-size: 14px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                border-radius: 0;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>📊 Laporan Stock {{ $period === 'weekly' ? 'Mingguan' : 'Bulanan' }}</h1>
            <p>{{ $dateRange }}</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Profit Highlight -->
            <div class="highlight">
                <div class="highlight-label">PROFIT {{ strtoupper($period === 'weekly' ? 'MINGGU INI' : 'BULAN INI') }}</div>
                <div class="highlight-value {{ $profit >= 0 ? 'profit-positive' : 'profit-negative' }}">
                    {{ $profit >= 0 ? '📈' : '📉' }} Rp {{ number_format(abs($profit), 0, ',', '.') }}
                </div>
                <div class="highlight-label">{{ $profit >= 0 ? 'Laba Bersih' : 'Rugi' }}</div>
            </div>

            <!-- Financial Summary -->
            <div class="card">
                <h2>💰 Ringkasan Finansial</h2>
                <div class="metric">
                    <span class="metric-label">Pengeluaran (Pembelian Stock)</span>
                    <span class="metric-value">Rp {{ number_format($totalCosts, 0, ',', '.') }}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Pemasukan (Penjualan)</span>
                    <span class="metric-value">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Margin Profit</span>
                    <span class="metric-value {{ $profit >= 0 ? 'profit-positive' : 'profit-negative' }}">
                        {{ $totalRevenue > 0 ? number_format(($profit / $totalRevenue) * 100, 1) : '0' }}%
                    </span>
                </div>
            </div>

            <!-- Stock Movement -->
            <div class="card">
                <h2>📦 Pergerakan Stock</h2>
                <div class="metric">
                    <span class="metric-label">📥 Stock Masuk</span>
                    <span class="metric-value">{{ number_format($stockIn) }} unit</span>
                </div>
                <div class="metric">
                    <span class="metric-label">📤 Stock Keluar</span>
                    <span class="metric-value">{{ number_format($stockOut) }} unit</span>
                </div>
                <div class="metric">
                    <span class="metric-label">📊 Selisih</span>
                    <span class="metric-value">{{ number_format($stockIn - $stockOut) }} unit</span>
                </div>
            </div>

            <!-- Current Stock -->
            <div class="card">
                <h2>🏢 Stock Saat Ini</h2>
                @if(count($warehouses) <= 3)
                    @foreach($warehouses as $warehouse)
                        <div class="warehouse-item">
                            <span class="warehouse-name">{{ $warehouse['name'] }}</span>
                            <span class="warehouse-stats">{{ $warehouse['items'] }} items • {{ number_format($warehouse['qty']) }} unit</span>
                        </div>
                    @endforeach
                @else
                    <div class="warehouse-item">
                        <span class="warehouse-name">{{ count($warehouses) }} Gudang Aktif</span>
                        <span class="warehouse-stats">Total aktif</span>
                    </div>
                @endif
                <div class="warehouse-item" style="background-color: #f1f5f9; margin: 10px -20px -20px -20px; padding: 15px 20px; border-radius: 0 0 8px 8px;">
                    <span class="warehouse-name">TOTAL KESELURUHAN</span>
                    <span class="warehouse-stats"><strong>{{ $totalItems }} items • {{ number_format($totalQty) }} unit</strong></span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Laporan otomatis dari <strong>Sistem GudangKu</strong></p>
            <p>Dikirim pada {{ now()->format('d/m/Y H:i') }} WIB</p>
        </div>
    </div>
</body>
</html>

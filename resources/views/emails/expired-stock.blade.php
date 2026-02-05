<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Peringatan Stock Expired</title>
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
            background: {{ $alertType === 'warning' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }};
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header .icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #1a202c;
        }
        .alert-box {
            background-color: {{ $alertType === 'warning' ? '#fff5f5' : '#ebf8ff' }};
            border-left: 4px solid {{ $alertType === 'warning' ? '#f56565' : '#4299e1' }};
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 4px;
        }
        .alert-box p {
            margin: 0;
            color: {{ $alertType === 'warning' ? '#742a2a' : '#2c5282' }};
            font-weight: 500;
        }
        .batch-item {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            border: 1px solid #e2e8f0;
        }
        .batch-item:last-child {
            margin-bottom: 0;
        }
        .batch-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e2e8f0;
        }
        .batch-icon {
            font-size: 24px;
            margin-right: 10px;
        }
        .batch-title {
            font-size: 18px;
            font-weight: 600;
            color: #1a202c;
            margin: 0;
        }
        .batch-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        .detail-item {
            display: flex;
            flex-direction: column;
        }
        .detail-label {
            font-size: 12px;
            color: #718096;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .detail-value {
            font-size: 14px;
            color: #2d3748;
            font-weight: 500;
        }
        .expired-badge {
            display: inline-block;
            background-color: {{ $alertType === 'warning' ? '#fed7d7' : '#bee3f8' }};
            color: {{ $alertType === 'warning' ? '#c53030' : '#2c5282' }};
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
        }
        .action-note {
            background-color: #fefcbf;
            border-left: 4px solid #ecc94b;
            padding: 15px;
            margin-top: 25px;
            border-radius: 4px;
        }
        .action-note p {
            margin: 0;
            color: #744210;
            font-size: 14px;
        }
        .footer {
            background-color: #f7fafc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 5px 0;
            font-size: 13px;
            color: #718096;
        }
        @media only screen and (max-width: 600px) {
            .batch-details {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">{{ $alertType === 'warning' ? '⚠️' : 'ℹ️' }}</div>
            <h1>Peringatan Stock Expired</h1>
            <p>{{ $days }} Hari Lagi</p>
        </div>

        <div class="content">
            <div class="greeting">
                Halo <strong>{{ $userName }}</strong>,
            </div>

            <div class="alert-box">
                <p>
                    Terdapat <strong>{{ count($batches) }} batch</strong> stock yang akan expired dalam
                    <strong>{{ $days }} hari</strong> ke depan.
                </p>
            </div>

            @foreach ($batches as $batch)
            <div class="batch-item">
                <div class="batch-header">
                    <span class="batch-icon">📦</span>
                    <h3 class="batch-title">{{ $batch['product_name'] }}</h3>
                </div>

                <div class="batch-details">
                    <div class="detail-item">
                        <span class="detail-label">Batch Number</span>
                        <span class="detail-value">{{ $batch['batch_number'] }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">SKU</span>
                        <span class="detail-value">{{ $batch['sku'] }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Gudang</span>
                        <span class="detail-value">{{ $batch['warehouse_name'] }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Quantity</span>
                        <span class="detail-value">{{ number_format($batch['current_qty']) }} unit</span>
                    </div>
                    <div class="detail-item" style="grid-column: 1 / -1;">
                        <span class="detail-label">Tanggal Expired</span>
                        <span class="detail-value">
                            <span class="expired-badge">{{ $batch['expired_at'] }}</span>
                        </span>
                    </div>
                </div>
            </div>
            @endforeach

            <div class="action-note">
                <p>⚡ <strong>Perhatian:</strong> Mohon segera lakukan tindakan yang diperlukan untuk menghindari kerugian akibat stock expired.</p>
            </div>
        </div>

        <div class="footer">
            <p><strong>GudangKu</strong></p>
            <p>Sistem Manajemen Gudang</p>
            <p style="margin-top: 10px; font-size: 12px;">
                Email otomatis - Mohon tidak membalas email ini
            </p>
        </div>
    </div>
</body>
</html>

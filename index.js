const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// YAHAN APNA CHANNEL ID LIKHEIN
const MY_CHANNEL_ID = '123456789@newsletter'; 
const AI_PROMPT = "Beautiful Pakistan Landscape, realistic, 8k";

let qrCodeData = "";
let clientReady = false;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote']
    }
});

client.on('qr', async (qr) => {
    console.log('QR RECEIVED');
    qrCodeData = await qrcode.toDataURL(qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
    clientReady = true;
});

app.get('/', (req, res) => {
    if (clientReady) {
        res.send('<h1>Bot is Running! 🚀</h1>');
    } else if (qrCodeData) {
        res.send(`<h1>Scan QR Code:</h1><img src="${qrCodeData}" />`);
    } else {
        res.send('<h1>Loading... Refresh inside 1 minute.</h1>');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Daily 8:00 AM Schedule
cron.schedule('0 8 * * *', async () => {
    if (!clientReady) return;
    try {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(AI_PROMPT)}`;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const media = new MessageMedia('image/jpeg', Buffer.from(response.data).toString('base64'));
        await client.sendMessage(MY_CHANNEL_ID, media, { caption: "Daily AI Art 🎨" });
    } catch (err) {
        console.error('Error:', err);
    }
}, { timezone: "Asia/Karachi" });

client.initialize();

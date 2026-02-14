const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');

const app = express();
const port = process.env.PORT || 3000;

let qrCodeData = "";

// Client Setup
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

// 1. QR Code Handle Karna
client.on('qr', async (qr) => {
    console.log('New QR Received');
    qrCodeData = await qrcode.toDataURL(qr);
});

// 2. JAB CONNECT HO JAYE TO ID DIKHAO (Ye hai wo Main Cheez)
client.on('ready', async () => {
    console.log('\n✅ BOT CONNECTED SUCCESSFULLY!\n');
    
    // Channels Dhoondna
    const chats = await client.getChats();
    
    console.log("👇👇👇 IS LIST MEIN APNI ID DEKHEIN 👇👇👇");
    console.log("==========================================");
    
    chats.forEach(chat => {
        // Sirf Channels (newsletter) filter karein
        if (chat.id.server === 'newsletter') {
            console.log(`📌 NAME: ${chat.name}`);
            console.log(`🆔 ID:   ${chat.id._serialized}`); // <--- YE HAI AAPKI ID
            console.log("==========================================");
        }
    });
});

// Web Server
app.get('/', (req, res) => {
    if (qrCodeData) {
        res.send(`<h1>Scan QR Code:</h1><img src="${qrCodeData}" />`);
    } else {
        res.send('<h1>Waiting for QR... Refresh in 10 seconds.</h1>');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

client.initialize();

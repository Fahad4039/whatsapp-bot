const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Client Setup
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// QR Code Dikhana
client.on('qr', (qr) => {
    console.log('QR Code aa gaya! Isay scan karein 👇');
    qrcode.generate(qr, { small: true });
});

// Jab WhatsApp Connect Ho Jaye
client.on('ready', async () => {
    console.log('\n✅ Client Connected! Ab Channels dhoond raha hoon...\n');

    try {
        // Saari Chats aur Channels lana
        const chats = await client.getChats();
        
        console.log("==============================================");
        console.log("       AAPKE JOIN KIYE HUWE CHANNELS");
        console.log("==============================================\n");

        let found = false;

        chats.forEach(chat => {
            // Sirf 'newsletter' (Channels) ko filter karna
            if (chat.id.server === 'newsletter') {
                console.log(`📌 NAAM:  ${chat.name}`);
                console.log(`🆔 ID:    ${chat.id._serialized}`);
                console.log("----------------------------------------------");
                found = true;
            }
        });

        if (!found) {
            console.log("❌ Koi Channel nahi mila! Kya aapne Channel Join kiya hai?");
        }

        console.log("\n==============================================");
        console.log("👆 Upar se 'ID' copy karein aur apne bot mein use karein.");
        
        // Kaam khatam, ab band kar do
        process.exit(0);

    } catch (err) {
        console.log("❌ Error aaya:", err);
    }
});

console.log("Bot start ho raha hai, please wait...");
client.initialize();

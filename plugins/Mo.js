import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import fs from 'fs';

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || !msg.key.remoteJid) return;
        const chatId = msg.key.remoteJid;
        const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (messageContent && messageContent.startsWith('دخول ')) {
            const mentionedJid = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(chatId, { text: '❌ يجب منشن الشخص الذي تريد الترحيب به!' });
                return;
            }

            const person = mentionedJid[0];
            const name = messageContent.replace('دخول ', '').trim();

            const welcomeMessage = `
┏━━━━━━━━━━━━━━━┓
┃ 🎉 دخول عضو جديد 🎉 ┃
┣━━━━━━━━━━━━━━━┫
┃ 👤 الشخص: @${person.split('@')[0]} ┃
┃ 🏷️ الاسم: ${name} ┃
┃ 📢 عدد أعضاء الجروب: *${(await sock.groupMetadata(chatId)).participants.length}* ┃
┗━━━━━━━━━━━━━━━┛
            `;

            const imagePath = './welcome-image.jpg'; // ضع صورة مناسبة في هذا المسار
            const imageExists = fs.existsSync(imagePath);

            if (imageExists) {
                const imageBuffer = fs.readFileSync(imagePath);
                await sock.sendMessage(chatId, { image: imageBuffer, caption: welcomeMessage, mentions: [person] });
            } else {
                await sock.sendMessage(chatId, { text: welcomeMessage, mentions: [person] });
            }
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        }
    });
}

startBot();
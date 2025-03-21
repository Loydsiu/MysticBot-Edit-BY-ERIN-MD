import fs from 'fs';

let handler = async (m, { conn }) => {
    const buttons = [
        { buttonId: 'owner', buttonText: { displayText: '👤 المطور' }, type: 1 },
        { buttonId: 'rules', buttonText: { displayText: '📜 القوانين' }, type: 1 }
    ];

    const buttonMessage = {
        text: "📌 اختر أحد الأزرار:",
        footer: "بوت واتساب",
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.command = ["معلومات", "info"];
export default handler;

// ** كود الرد التلقائي عند الضغط على الأزرار **
conn.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        let m = chatUpdate.messages[0];
        if (!m.message || !m.message.buttonResponseMessage) return;

        let buttonId = m.message.buttonResponseMessage.selectedButtonId;

        if (buttonId === 'owner') {
            await conn.sendMessage(m.key.remoteJid, { text: "👤 المطور: @123456789", mentions: ["123456789@s.whatsapp.net"] }, { quoted: m });
        } else if (buttonId === 'rules') {
            await conn.sendMessage(m.key.remoteJid, { text: "📜 القوانين:\n1️⃣ لا ترسل سبام.\n2️⃣ احترم الأعضاء.\n3️⃣ لا تنشر روابط." }, { quoted: m });
        }
    } catch (err) {
        console.error(err);
    }
});

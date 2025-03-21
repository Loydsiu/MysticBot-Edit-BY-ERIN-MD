import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    try {
        // التأكد من أن `m.mentionedJid` موجودة وإلا يتم تعيينها للمُرسل نفسه
        let mentioned = m.mentionedJid && m.mentionedJid.length ? m.mentionedJid : [m.sender];

        // جلب صورة من API
        let res = await fetch('https://api.waifu.pics/sfw/pat');
        if (!res.ok) throw new Error('فشل في جلب الصورة من API');
        let json = await res.json();
        let { url } = json;

        // إنشاء نص الرسالة
        let msg = `🤗 ${mentioned.map(user => (user === m.sender) ? 'أحدهم' : `@${user.split('@')[0]}`).join(', ')} تلقى تربيتًا دافئًا!`;

        // إنشاء الملصق
        let stiker = await sticker(null, url, msg);

        // إرسال الملصق
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, { asSticker: true });

    } catch (e) {
        console.error(e);
        m.reply('❌ حدث خطأ أثناء تنفيذ الأمر. حاول مرة أخرى لاحقًا.');
    }
}

// أوامر لتشغيل الكود
handler.command = /^(تربيت|ربت|pat)$/i;
export default handler;

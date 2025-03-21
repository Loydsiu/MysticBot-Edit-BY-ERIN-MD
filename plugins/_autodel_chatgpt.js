import fs from 'fs';
import path from 'path';
import canvacord from 'canvacord';

let handler = async (m, { conn }) => {
    let folderPath = './stickers';
    let imageFiles = fs.readdirSync(folderPath).filter(file => /\.(jpg|jpeg|png)$/i.test(file));

    if (imageFiles.length === 0) {
        return conn.reply(m.chat, '⚠️ لا توجد صور في مجلد الملصقات.', m);
    }

    let randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    let imagePath = path.join(folderPath, randomImage);

    let imageBuffer = fs.readFileSync(imagePath);
    let sticker = await canvacord.Canvas.circle(imageBuffer); // تحويل الصورة إلى ملصق دائري

    await conn.sendMessage(m.chat, { sticker: { url: sticker } }, { quoted: m });
};

handler.command = /^وت$/i;
export default handler;

import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
    let folderPath = './images'; // المسار إلى مجلد الصور

    // قراءة الملفات داخل المجلد
    fs.readdir(folderPath, async (err, files) => {
        if (err) {
            console.error('خطأ في قراءة المجلد:', err);
            return conn.reply(m.chat, '❌ حدث خطأ أثناء جلب الصور.', m);
        }

        // التأكد من وجود صور
        let imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        if (imageFiles.length === 0) {
            return conn.reply(m.chat, '⚠️ لا توجد صور في المجلد.', m);
        }

        // اختيار صورة عشوائية
        let randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        let imagePath = path.join(folderPath, randomImage);

        // إرسال الصورة
        let caption = "📜 *إليك صورة شعرية : اكيد عمك لويد بحبك*";
        await conn.sendMessage(m.chat, { image: { url: imagePath }, caption: caption }, { quoted: m });
    });
};

handler.command = /^(شعر|قصيدة|بيت_شعر)$/i;
export default handler;

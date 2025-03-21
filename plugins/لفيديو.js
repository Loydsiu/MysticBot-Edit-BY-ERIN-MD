import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m, { conn, usedPrefix, command }) => {
    // التأكد من أن الرسالة المقتبسة هي ملصق متحرك
    if (!m.quoted || m.quoted.mtype !== 'stickerMessage') {
        return conn.reply(m.chat, "❌ *يجب الرد على ملصق متحرك لتحويله إلى فيديو!*", m);
    }

    let media;
    try {
        // محاولة تحميل الملصق
        media = await m.quoted.download();
        if (!media) throw new Error("فشل في تحميل الملصق");
    } catch (e) {
        // إذا فشل التحميل، يتم إرسال رسالة خطأ
        return conn.reply(m.chat, "⚠️ *حدث خطأ أثناء تحميل الملصق، حاول مرة أخرى!*", m);
    }

    conn.reply(m.chat, "⏳ *جاري تحويل الملصق إلى فيديو...*", m);

    try {
        // إنشاء FormData لإرسال الملف
        let form = new FormData();
        form.append("file", media, "sticker.webp");

        // إرسال الطلب إلى API لتحويل الملصق إلى فيديو
        let res = await fetch("https://api.sr.ht/~whatsdev/webp2mp4", {
            method: "POST",
            body: form
        });

        // التحقق من استجابة الخادم
        if (!res.ok) throw new Error("فشل في الاتصال بالخادم");

        let json = await res.json();

        // التأكد من وجود الرابط الخاص بالفيديو في الاستجابة
        if (!json.mp4) throw new Error("لم يتم العثور على الفيديو");

        // إرسال الفيديو المحول إلى الدردشة
        await conn.sendMessage(m.chat, { video: { url: json.mp4 }, caption: "🎥 *تم تحويل الملصق إلى فيديو بنجاح!*" }, { quoted: m });
    } catch (e) {
        // التعامل مع الأخطاء في حالة حدوث أي مشكلة أثناء التحويل
        console.error("❌ خطأ أثناء التحويل:", e);
        return conn.reply(m.chat, "❌ *فشل تحويل الملصق إلى فيديو، حاول مرة أخرى لاحقًا!*", m);
    }
};

handler.command = ["لفيديو"];
export default handler;

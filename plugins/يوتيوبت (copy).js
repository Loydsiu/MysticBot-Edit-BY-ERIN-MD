import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    let query = args.join(" ") || "أنمي"; // الكلمة التي يريد المستخدم البحث عنها
    let apiUrl = `https://api-streamline-pro.vercel.app/api/ai/text2art?text=${encodeURIComponent(query)}`;

    try {
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (json.status !== "success ✅" || !json.data.length) {
            return conn.reply(m.chat, "⚠️ لم يتم العثور على أي صور لهذا البحث!", m);
        }

        let image = json.data[0].img_url; // اختيار أول صورة فقط
        let caption = `🎨 *نتيجة البحث عن:* ${query}\n🖼 *وصف الصورة:* ${json.data[0].prompt}`;

        await conn.sendMessage(m.chat, { image: { url: image }, caption });

    } catch (error) {
        console.error(error);
        conn.reply(m.chat, "⚠️ حدث خطأ أثناء البحث عن الصورة. حاول مرة أخرى لاحقًا!", m);
    }
};

handler.command = /^(رسم|صورة|ابداع)$/i;
export default handler;

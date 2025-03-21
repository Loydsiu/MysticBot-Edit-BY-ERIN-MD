import axios from "axios";

let handler = async (m, { conn, text }) => {
    if (!text) return conn.sendMessage(m.chat, { text: "❌ *يرجى كتابة شيء بعد 'sanon' للبحث عنه!*" }, { quoted: m });

    try {
        // البحث عن صورة عبر Pexels API
        let searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(text)}&per_page=1`;
        let response = await axios.get(searchUrl, {
            headers: { Authorization: "FjXPgbfJZCTHNV5foTeSqNDTqHRx0z8QFZBkfkSHMmRFUVDT4LTJZwMi" },
        });

        if (!response.data.photos.length) {
            return conn.sendMessage(m.chat, { text: "⚠️ *لم يتم العثور على صورة لهذا البحث!*" }, { quoted: m });
        }

        let imageUrl = response.data.photos[0].src.medium; // رابط الصورة

        // إرسال الصورة كملصق
        await conn.sendMessage(m.chat, { sticker: { url: imageUrl } }, { quoted: m });
    } catch (error) {
        console.error("⚠️ خطأ أثناء البحث:", error);
        return conn.sendMessage(m.chat, { text: "❌ *حدث خطأ أثناء البحث!*" }, { quoted: m });
    }
};

handler.command = /^sanon$/i;
export default handler;

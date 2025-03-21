import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return await conn.sendMessage(m.chat, { text: "❌ الرجاء إدخال السؤال بعد الأمر!" }, { quoted: m });

  let apiUrl = `https://api-streamline.onrender.com/api/ai/gpt-4o-mini-v2?prompt=${encodeURIComponent(text)}&userid=${m.sender}`;

  try {
    let response = await fetch(apiUrl);
    let data = await response.json();

    if (data.status === "success ✅") {
      await conn.sendMessage(m.chat, { text: `*رد لويد*:\n${data.gpt}\n✦━━━━━━[ 𝐋𝐎𝐘𝐃-𝐁𝐎𝐓 ]━━━━━━✦` }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { text: "❌ حدث خطأ أثناء جلب البيانات!" }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: "⚠️ خطأ في الاتصال بـ API!" }, { quoted: m });
  }
};

handler.command = /^(gpt|ذكاء|لويد)$/i;
export default handler;

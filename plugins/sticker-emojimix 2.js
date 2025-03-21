import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return await conn.sendMessage(m.chat, { text: "❌ الرجاء إرسال سؤالك لـ ChatGPT!" }, { quoted: m });

  let apiUrl = `https://api-streamline-pro.vercel.app/api/ai/chatgpt?prompt=${encodeURIComponent(text)}&userid=${m.sender}`;

  try {
    let response = await fetch(apiUrl);
    let data = await response.json();

    if (data.status === "success" && data.chatgpt) {
      await conn.sendMessage(m.chat, { text: `🤖 **ChatGPT:** ${data.chatgpt}` }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { text: "⚠️ لم يتم الحصول على رد من ChatGPT!" }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: "🚨 حدث خطأ أثناء التواصل مع ChatGPT!" }, { quoted: m });
  }
};

handler.command = /^(ai|gpt|شات)$/i;
export default handler;

import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return await conn.sendMessage(m.chat, { text: "❌ الرجاء إرسال رابط فيديو تيك توك!" }, { quoted: m });

  let apiUrl = `https://api-streamline-pro.vercel.app/api/downloader/tiktok?url=${encodeURIComponent(text)}`;

  try {
    let response = await fetch(apiUrl);
    let data = await response.json();

    if (data.status === "success ✅" && data.download.length > 0) {
      let video = data.download[0];

      let caption = `🎥 **تم تحميل فيديو تيك توك** 🎥\n\n`
        + `📌 **العنوان:** ${video.title}\n`
        + `👤 **الناشر:** ${video.author.nickname} (@${video.author.unique_id})\n`
        + `📈 **عدد المشاهدات:** ${video.play_count}\n`
        + `👍 **الإعجابات:** ${video.digg_count}\n`
        + `💬 **التعليقات:** ${video.comment_count}\n`
        + `📤 **المشاركات:** ${video.share_count}\n\n`
        + `⬇️ **رابط التحميل:** ${video.play}`;

      await conn.sendMessage(m.chat, { video: { url: video.play }, caption: caption }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { text: "⚠️ لم يتم العثور على الفيديو!" }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: "🚨 حدث خطأ أثناء جلب الفيديو!" }, { quoted: m });
  }
};

handler.command = /^(تيك_توك|tiktok)$/i;
export default handler;

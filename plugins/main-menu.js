import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    let imageUrl = 'https://qu.ax/LQfVY.png';

    let d = new Date();
    let locale = 'ar';
    let week = d.toLocaleDateString(locale, { weekday: 'long' });
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    let time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    let uptime = process.uptime() * 1000;
    let totalUsers = Object.keys(global.db.data.users).length; // عدد المستخدمين المسجلين
    let taguser = '@' + m.sender.split('@')[0];

    let commandsList = `
⎔⋅• ━ ╼╃ ⌬〔﷽〕⌬ ╄╾ ━ •⋅⎔*

✦━━━━━━[𝐋𝐎𝐘𝐃-𝐁𝐎𝐓]━━━━━━✦
┃ 👤 المستخدم: *${taguser}*
┃ ⏳ وقت التشغيل: *${clockString(uptime)}*
┃ 📅 التاريخ: *${date}*
┃ 🌍 التوقيت: *${time}*
┃ 👥 عدد المستخدمين: *${totalUsers}*
✦━━━━━━[𝐋𝐎𝐘𝐃-𝐁𝐎𝐓]━━━━━━✦
💸 *قائمة الأوامر*
✦━━━━━━[𝐋𝐎𝐘𝐃-𝐁𝐎𝐓]━━━━━━✦

🦇 *قـسـم الاعـضـاء :* (.1)
🕋 *القـسـم الاسـلامـي :* (.2)
👑 *قسم الـمـطـور :* (.3)
⚡️ *قـسـم الـتنـزيـلات :* (.4)
🎮 *قـسـم الالــعــاب :* (.5)
♻️ *قـسـم التـحـويلات :* (.6)
🤖 *قـسـم الذكاء الاصطناعي :* (.7)
🚨 *قـسـم الـدعم :* (.8)
👨🏻‍💻 *قـسـم الـمـشـرفـيـن :* (.9)
🔍 *قـسـم الـبـحــث :* (.10) 
✦━━━━━━[ 𝐋𝐎𝐘𝐃-𝐁𝐎𝐓 ]━━━━━━✦
 *تحب الشاي ولا القهوة*
✦━━━━━━[ 𝐋𝐎𝐘𝐃-𝐁𝐎𝐓 ]━━━━━━✦`.trim();

    let message = {
      image: { url: imageUrl },
      caption: commandsList,
      mentions: [m.sender],
      footer: '𝐋𝐎𝐘𝐃-𝐁𝐎𝐓',
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 1,
          title: '𝐋𝐎𝐘𝐃-𝐁𝐎𝐓',
          thumbnailUrl: imageUrl, // استخدام نفس الصورة
          sourceUrl: 'https://chat.whatsapp.com/IoVOi6s5jwuFQzoEhmymfR',
        },
      },
    };

    conn.sendMessage(m.chat, message, { quoted: m });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '*خــطــاء فــي إرســال الــقــائــمــة 『📍』*', m);
  }
};

handler.command = /^(اوامر|menu|مهام|الاوامر)$/i;
export default handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

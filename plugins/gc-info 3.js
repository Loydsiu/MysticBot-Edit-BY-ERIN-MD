import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    let pp = 'https://qu.ax/uGgFR.jpg'; // استبدل هذا برابط صورة مناسب
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let taguser = '@' + m.sender.split("@s.whatsapp.net")[0];

    let str = `╭────『👑┇LOYD┇🤖┇BOT┇👑』
│
│ *➤ مرحبا ${taguser}*
│
│ *=> 🤖 وقت عمل البوت:* ${uptime}
│ *=> ✅ البوت عام للجميع*
│ *=> 👑 تم تطويري بواسطة لويد*
│ *=> 🔗 رقم المطور:* *https://wa.me/+4917672339436*
╰────────────────`.trim();

    // إرسال الصورة مع النص
    await conn.sendMessage(m.chat, { image: { url: pp }, caption: str }, { quoted: m });

  } catch (e) {
    console.error('❌ حدث خطأ:', e);
  }
};

handler.help = ['هروبي'];
handler.tags = ['info'];
handler.command = /^(سر)$/i;

export default handler;

// دالة لحساب وقت التشغيل
function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms % 3600000 / 60000);
  let s = Math.floor(ms % 60000 / 1000);
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

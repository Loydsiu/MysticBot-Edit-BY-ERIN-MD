import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    let imageUrl = 'https://qu.ax/LQfVY.png';

    let d = new Date();
    let locale = 'ar';
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    let time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    let uptime = process.uptime() * 1000;
    let totalUsers = Object.keys(global.db.data.users).length;
    let taguser = '@' + m.sender.split('@')[0];

    let listMessage = {
      text: `*👤 المستخدم:* ${taguser}\n*⏳ وقت التشغيل:* ${clockString(uptime)}\n*📅 التاريخ:* ${date}\n*🌍 التوقيت:* ${time}\n*👥 عدد المستخدمين:* ${totalUsers}\n\n*اختر أحد الأقسام من القائمة أدناه:*`,
      footer: '𝐋𝐎𝐘𝐃-𝐁𝐎𝐓',
      buttonText: '📜 اختر قسماً',
      sections: [
        {
          title: "🛠 قائمة الأوامر",
          rows: [
            { title: "🦇 قـسـم الاعـضـاء", rowId: ".1" },
            { title: "🕋 القـسـم الاسـلامـي", rowId: ".2" },
            { title: "👑 قسم الـمـطـور", rowId: ".3" },
            { title: "⚡️ قـسـم الـتنـزيـلات", rowId: ".4" },
            { title: "🎮 قـسـم الالــعــاب", rowId: ".5" },
            { title: "♻️ قـسـم التـحـويلات", rowId: ".6" },
            { title: "🤖 قـسـم الذكاء الاصطناعي", rowId: ".7" },
            { title: "🚨 قـسـم الـدعم", rowId: ".8" },
            { title: "👨🏻‍💻 قـسـم الـمـشـرفـيـن", rowId: ".9" },
            { title: "🔍 قـسـم الـبـحــث", rowId: ".10" }
          ]
        }
      ]
    };

    await conn.sendMessage(m.chat, listMessage, { quoted: m });
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

const handler = async (m, {conn, text, command, usedPrefix}) => {
  const pp = './src/Menu2.jpg';
  let who;
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text;
  else who = m.chat;
  const user = global.db.data.users[who];
  const bot = global.db.data.settings[conn.user.jid] || {};
  const warntext = `*[❗] منشن شخص او قم بالرد علي رساله *\n\n*—◉ مثال:*\n*${usedPrefix + command} @${global.suittag}*`;
  if (!who) throw m.reply(warntext, m.chat, {mentions: conn.parseMention(warntext)});
  if (m.mentionedJid.includes(conn.user.jid)) return;
  if (user.warn == 0) throw '*[❗] المستخدم عنده  0 تحذير*';
  user.warn -= 1;
  await m.reply(`${user.warn == 1 ? `*@${who.split`@`[0]}*` : `♻️ *@${who.split`@`[0]}*`} تم حذف تحذير واحر\n*عدد التحذيرات الان ${user.warn}/4*`, null, {mentions: [who]});
};
handler.command = /^(unwarn|حذف-انذار|الغاء-التحذير|حذف-التحزير|delwarning)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
export default handler;
let handler = async (m, { conn, isOwner, text }) => {
  let who = m.mentionedJid && m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.fromMe 
          ? conn.user.jid 
          : m.sender;  

  let user = conn.getName(who);
  let pareja = global.db.data.users[who]?.pasangan || null;
  let relaciones = Object.entries(global.db.data.users)
      .filter(([_, data]) => data.pasangan)
      .map(([jid, data], i) => `
      💑 *${i + 1}.* ${conn.getName(jid)} ❤️ ${conn.getName(data.pasangan)}
      ⏳ منذ: ${data.relationshipDuration || 'غير محدد'}
  `);

  let caption = `💝 *قائمة العلاقات*
  *المجموع: ${relaciones.length} مستخدمين*
  ${relaciones.length > 0 ? relaciones.join('\n') : '🚫 لا توجد علاقات مسجلة حتى الآن.'}`;

  if (text) {
      let search = relaciones.find(rel => rel.includes(text));
      caption = search ? `🔍 *نتيجة البحث:*
      ${search}` : '❌ لم يتم العثور على علاقة بهذا الاسم.';
  }

  m.reply(caption);
};

handler.help = ['lista-pareja'];
handler.tags = ['fun'];
handler.command = ['العلاقات'];

export default handler;

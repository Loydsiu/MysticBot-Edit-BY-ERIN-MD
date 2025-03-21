let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!isAdmin) return m.reply('❌ هذا الأمر مخصص للمشرفين فقط!');
  if (!isBotAdmin) return m.reply('❌ يجب أن يكون البوت مشرفًا لاستخدام هذا الأمر!');

  try {
      // الحصول على رابط الدعوة للمجموعة
      let inviteLink = await conn.groupInviteCode(m.chat);

      // إرسال رابط الدعوة
      m.reply(`🔗 رابط دعوة للمجموعة: https://chat.whatsapp.com/${inviteLink}`);
  } catch (e) {
      m.reply('❌ فشل في الحصول على رابط الدعوة، تأكد من أن البوت مشرف في المجموعة!');
  }
};

handler.help = ['رابط'];
handler.tags = ['group'];
handler.command = ['رابط'];

export default handler;

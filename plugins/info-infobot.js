let handler = async (m, { conn, args, isAdmin, isBotAdmin }) => {
  if (!isAdmin) return m.reply('❌ هذا الأمر مخصص للمشرفين فقط!');
  if (!isBotAdmin) return m.reply('❌ يجب أن يكون البوت مشرفًا لاستخدام هذا الأمر!');

  let duration = args[0] ? parseInt(args[0]) : 5; // الافتراضي 5 دقائق
  if (isNaN(duration) || duration <= 0) return m.reply('💡 الرجاء إدخال مدة القفل بالدقائق، مثال: سكر 5');

  m.reply(`🕒 سيتم إغلاق المجموعة بعد ${duration} دقائق.`);

  setTimeout(async () => {
      for (let i = 5; i > 0; i--) {
          await conn.sendMessage(m.chat, { text: `⏳ سيتم إغلاق المجموعة بعد ${i} ثوانٍ...` });
          await new Promise(res => setTimeout(res, 1000));
      }

      await conn.groupSettingUpdate(m.chat, 'announcement');
      m.reply('🔒 تم إغلاق المجموعة!');
  }, (duration - 1) * 60000);
};

handler.help = ['سكر [عدد الدقائق]'];
handler.tags = ['group'];
handler.command = ['سكر'];

export default handler;

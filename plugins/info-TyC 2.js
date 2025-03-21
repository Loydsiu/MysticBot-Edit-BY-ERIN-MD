let handler = async (m, { conn, args, isAdmin, isBotAdmin }) => {
  if (!isAdmin) return m.reply('❌ هذا الأمر مخصص للمشرفين فقط!');
  if (!isBotAdmin) return m.reply('❌ يجب أن يكون البوت مشرفًا لاستخدام هذا الأمر!');

  let duration = args[0] ? parseInt(args[0]) : 5; // الافتراضي 5 دقائق
  if (isNaN(duration) || duration <= 0) return m.reply('💡 الرجاء إدخال مدة الانتظار بالدقائق، مثال: افتح 5');

  m.reply(`⏳ سيتم فتح المجموعة بعد ${duration} دقائق...`);

  setTimeout(async () => {
      await conn.groupSettingUpdate(m.chat, 'not_announcement');
      m.reply('🔓 تم فتح المجموعة! يمكن للجميع التحدث الآن.');
  }, duration * 60000);
};

handler.help = ['افتح [عدد الدقائق]'];
handler.tags = ['group'];
handler.command = ['افتح'];

export default handler;

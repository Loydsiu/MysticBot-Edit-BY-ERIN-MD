let protectionStatus = {}; // تخزين حالة الحماية لكل مجموعة

let handler = async (m, { conn, isAdmin, isBotAdmin, participants }) => {
  if (!m.isGroup) return; // تأكد أن الرسالة في مجموعة فقط

  let chatId = m.chat;

  // التحقق من تهيئة الحماية للمجموعة
  if (!(chatId in protectionStatus)) {
    protectionStatus[chatId] = false;
  }

  // التأكد من أن الرسالة تحتوي على نص قبل محاولة معالجتها
  if (typeof m.text === 'string') {
    let text = m.text.toLowerCase();

    // تفعيل الحماية
    if (text === 'تشغيل الحماية' && isAdmin) {
      protectionStatus[chatId] = true;
      return conn.sendMessage(chatId, { text: '✅ *تم تشغيل الحماية ضد إضافة المشرفين!*' });
    }

    // تعطيل الحماية
    if (text === 'إيقاف الحماية' && isAdmin) {
      protectionStatus[chatId] = false;
      return conn.sendMessage(chatId, { text: '❌ *تم إيقاف الحماية ضد إضافة المشرفين!*' });
    }
  }

  // **التأكد من أن الحماية مفعلة قبل منع الترقية**
  if (protectionStatus[chatId] && m.action === 'promote') {
    let newAdmin = m.participants[0]; // المشرف الجديد

    // التحقق مما إذا كان البوت نفسه مشرفًا (لإزالة الترقية)
    if (!isBotAdmin) {
      return conn.sendMessage(chatId, { text: '⚠️ *لا يمكن تنفيذ الإجراء لأن البوت ليس مشرفًا!*' });
    }

    // إلغاء الترقية وإرسال رسالة تنبيه
    await conn.groupParticipantsUpdate(chatId, [newAdmin], 'demote');
    return conn.sendMessage(chatId, { text: `🚨 *تم إزالة صلاحيات المشرف عن ${await conn.getName(newAdmin)}!* 🛑` });
  }
};

handler.help = ['adminprotect'];
handler.tags = ['group'];
handler.command = ['adminprotect', 'الحماية', 'إيقاف الحماية'];
handler.group = true;
handler.admin = true;

export default handler;

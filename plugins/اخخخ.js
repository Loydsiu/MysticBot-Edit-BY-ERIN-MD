let handler = async (update, { conn }) => {
  try {
    const { id, participants, action } = update; // استخراج معلومات المجموعة والمشاركين
    const chat = global.db.data.chats[id]; // الحصول على بيانات المجموعة من قاعدة البيانات

    // التحقق من أن الحدث هو انضمام عضو جديد
    if (action === 'add') {
      for (let participant of participants) {
        // رسالة افتراضية أو مخصصة
        let welcomeMessage = chat && chat.sWelcome
          ? chat.sWelcome // رسالة الترحيب المخصصة
          : `🎉 مرحبًا @${participant.split('@')[0]} في مجموعة "${await conn.getName(id)}"! 😊`;

        // استبدال القيم الديناميكية
        let text = welcomeMessage
          .replace(/@user/g, `@${participant.split('@')[0]}`) // استبدال @user باسم العضو
          .replace(/@group/g, await conn.getName(id)) // استبدال @group باسم المجموعة
          .replace(/@desc/g, (await conn.groupMetadata(id)).desc || 'لا يوجد وصف للمجموعة'); // استبدال @desc بوصف المجموعة

        // إرسال رسالة الترحيب
        await conn.sendMessage(id, { text: text, mentions: [participant] });
      }
    }

    // التحقق من أن الحدث هو مغادرة عضو
    if (action === 'remove') {
      for (let participant of participants) {
        // رسالة افتراضية أو مخصصة عند المغادرة
        let goodbyeMessage = chat && chat.sGoodbye
          ? chat.sGoodbye // رسالة المغادرة المخصصة
          : `😢 وداعًا @${participant.split('@')[0]}! نأمل أن نراك قريبًا في مجموعة "${await conn.getName(id)}".`;

        // استبدال القيم الديناميكية
        let text = goodbyeMessage
          .replace(/@user/g, `@${participant.split('@')[0]}`) // استبدال @user باسم العضو
          .replace(/@group/g, await conn.getName(id)); // استبدال @group باسم المجموعة

        // إرسال رسالة المغادرة
        await conn.sendMessage(id, { text: text, mentions: [participant] });
      }
    }
  } catch (err) {
    console.error('⚠️ خطأ في إرسال الرسالة:', err);
  }
};

// ربط الكود بحدث انضمام أو مغادرة الأعضاء
handler.event = ['group-participants-update']; // يراقب انضمام أو مغادرة الأعضاء

export default handler;

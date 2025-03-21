let handler = async (m, { conn }) => {
  try {
    // التحقق من وجود بيانات الدردشة في قاعدة البيانات
    let chat = global.db.data.chats[m.chat];

    // استخدام رسالة افتراضية إذا لم يتم تعيين رسالة مخصصة
    let welcomeMessage = chat && chat.sWelcome
      ? chat.sWelcome // إذا كانت رسالة مخصصة موجودة
      : '🎉 مرحبًا بك @user في مجموعة @group! 😊'; // رسالة افتراضية

    // إعداد الرسالة مع استبدال القيم الديناميكية
    let text = welcomeMessage
      .replace(/@user/g, `@${m.sender.split('@')[0]}`) // استبدال @user بالإشارة إلى المستخدم
      .replace(/@group/g, m.chat) // استبدال @group باسم المجموعة
      .replace(/@desc/g, (await conn.groupMetadata(m.chat)).desc || 'لا يوجد وصف للمجموعة'); // استبدال @desc بوصف المجموعة

    // إرسال رسالة الترحيب
    conn.sendMessage(m.chat, { text: text, mentions: [m.sender] });
  } catch (err) {
    console.error(err);
  }
};

// الحدث المرتبط عند انضمام عضو جديد
handler.event = ['group-participants-update'];

export default handler;

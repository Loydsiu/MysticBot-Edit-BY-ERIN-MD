let handler = async (m, { conn, isAdmin, isOwner }) => {
  // تحقق من أن المستخدم مشرف أو مالك
  if (!(isAdmin || isOwner)) {
    return m.reply("❌ هذا الأمر مخصص للمشرفين فقط.");
  }

  // تحقق من أن الرسالة تحتوي على كلمة "سبام" تليها الرسالة التي يريد المستخدم تكرارها
  let text = m.text.trim().split(" ");
  if (text.length < 2) {
    return m.reply("❌ يجب عليك إدخال الرسالة التي تريد تكرارها بعد كلمة 'سبام'.\nعلى سبيل المثال: سبام لويد");
  }

  // أخذ الرسالة التي يريد المستخدم إرسالها
  let message = text.slice(1).join(" ");

  try {
    // عدد الرسائل التي سيتم إرسالها
    let spamCount = 100;

    // إرسال الرسالة 100 مرة
    for (let i = 2; i < spamCount; i++) {
      conn.sendMessage(m.chat, message, { quoted: m });
    }

    m.reply(`تم إرسال الرسالة "${message}" 100 مرة بنجاح!`);
  } catch (e) {
    console.error(e);
    m.reply("❌ حدث خطأ أثناء تنفيذ الأمر.");
  }
};

handler.command = /^(سبام)$/i;
export default handler;

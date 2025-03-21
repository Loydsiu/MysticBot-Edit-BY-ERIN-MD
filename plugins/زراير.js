let handler = async (m, { conn }) => {
  // تحقق إذا كانت الرسالة تحتوي على كلمة "المهام"
  if (/المهام/i.test(m.text)) {
    try {
      // إعداد الأزرار
      let buttons = [
        { buttonId: 'm1', buttonText: { displayText: 'مهمة 1' }, type: 1 },
        { buttonId: 'm2', buttonText: { displayText: 'مهمة 2' }, type: 1 },
        { buttonId: 'm3', buttonText: { displayText: 'مهمة 3' }, type: 1 },
        { buttonId: 'm4', buttonText: { displayText: 'مهمة 4' }, type: 1 }
      ];

      // رسالة مع الأزرار
      let buttonMessage = {
        text: 'اختر المهمة التي تريد تنفيذها:',
        footer: 'بوت المهام',
        buttons: buttons,
        headerType: 1
      };

      // إرسال الرسالة مع الأزرار
      await conn.sendMessage(m.chat, buttonMessage, { quoted: m });

    } catch (e) {
      console.error(e);
      m.reply("❌ حدث خطأ أثناء إرسال الأزرار.");
    }
  }
};

// التعامل مع الأزرار بعد الضغط عليها
let buttonHandler = async (m, { conn }) => {
  if (m.type === 'buttonsResponseMessage') {
    let buttonId = m.message.buttonsResponseButtonId;

    // تحقق من الزر الذي ضغط عليه المستخدم
    switch (buttonId) {
      case 'm1':
        conn.sendMessage(m.chat, "لقد اخترت مهمة 1: تنفيذ المهام الأولى.");
        break;
      case 'm2':
        conn.sendMessage(m.chat, "لقد اخترت مهمة 2: تنفيذ المهام الثانية.");
        break;
      case 'm3':
        conn.sendMessage(m.chat, "لقد اخترت مهمة 3: تنفيذ المهام الثالثة.");
        break;
      case 'm4':
        conn.sendMessage(m.chat, "لقد اخترت مهمة 4: تنفيذ المهام الرابعة.");
        break;
      default:
        conn.sendMessage(m.chat, "❌ لم يتم تحديد المهمة.");
        break;
    }
  }
};

handler.command = /^(يلا)$/i;
handler.buttons = buttonHandler;
export default handler;

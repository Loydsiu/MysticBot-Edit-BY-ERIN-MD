const { Module } = require("../lib");

Module(
  {
    pattern: "button",
    fromMe: true,
    desc: "إرسال رسالة تحتوي على أزرار تفاعلية",
    usage: "#button",
    type: "message",
  },
  async (message) => {
    let buttons = [
      {
        buttonId: ".م1",
        buttonText: { displayText: "📜 القائمة" },
        type: 1,
      },
      {
        buttonId: "#help",
        buttonText: { displayText: "❓ المساعدة" },
        type: 1,
      },
      {
        buttonId: "#contact",
        buttonText: { displayText: "📞 تواصل معنا" },
        type: 1,
      },
    ];

    let buttonMessage = {
      text: "✨ *مرحبا بك في البوت!*\nاختر أحد الأزرار أدناه:",
      footer: "🤖 بوت واتساب",
      buttons: buttons,
      headerType: 1,
    };

    await message.sendMessage(message.jid, buttonMessage, {}, "buttonsMessage");
  }
);

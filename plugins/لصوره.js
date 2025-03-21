let handler = async (m, { conn }) => {
  const buttons = [
    {
      buttonId: 'لو',
      buttonText: { displayText: '🟢 خيار 1' },
      type: 1
    },
    {
      buttonId: 'لكرتون',
      buttonText: { displayText: '🔵 خيار 2' },
      type: 1
    },
    {
      buttonId: 'لينك',
      buttonText: { displayText: '🌍 زيارة الموقع' },
      type: 1
    }
  ];

  const buttonMessage = {
    text: '👋 مرحباً! اختر أحد الأزرار أدناه:',
    footer: '💡 اختر أحد الخيارات',
    buttons: buttons,
    headerType: 1
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.help = ['buttons'];
handler.tags = ['test'];
handler.command = /^(buttons|فيو)$/i;

export default handler;

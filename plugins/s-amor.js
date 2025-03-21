const timeout = 5000; // الوقت المسموح للقفز (5 ثواني)
const points = 100;

const handler = async (m, { conn }) => {
  conn.marioGame = conn.marioGame ? conn.marioGame : {};
  const id = m.chat;

  if (id in conn.marioGame) {
    conn.reply(m.chat, '*❌ لديك لعبة جارية بالفعل! حاول إنهاءها أولًا.*', m);
    throw false;
  }

  const obstacles = ["🔥 نيران!", "🕳️ حفرة!", "👾 عدو!"];
  const obstacle = obstacles[Math.floor(Math.random() * obstacles.length)];

  const caption = `
🚀 **ماريو يركض!** 🏃💨
💥 **عقبة أمامك:** ${obstacle}
🕒 لديك *5 ثواني* للرد بـ *"قفز"* لتجنبها!
🎁 الجائزة: ${points} نقطة
  `;

  conn.marioGame[id] = {
    message: await conn.reply(m.chat, caption, m),
    answer: "قفز",
    points: points,
    timeout: setTimeout(async () => {
      if (conn.marioGame[id]) {
        await conn.reply(m.chat, `❌ *لقد اصطدمت بـ ${obstacle}!* 😢\n🎮 حاول مرة أخرى!`, conn.marioGame[id].message);
        delete conn.marioGame[id];
      }
    }, timeout),
  };
};

// التحقق من الإجابة
const checkAnswer = async (m, { conn }) => {
  const id = m.chat;
  if (!conn.marioGame || !(id in conn.marioGame)) return;

  const game = conn.marioGame[id];
  if (m.text.toLowerCase() === game.answer.toLowerCase()) {
    await conn.reply(m.chat, `🎉 *قفزة ناجحة!* ✅\n🏆 ربحت ${game.points} نقطة!`, m);
    clearTimeout(game.timeout);
    delete conn.marioGame[id];
  } else {
    m.reply('❌ *إجابة خاطئة! حاول مجددًا!*');
  }
};

handler.before = checkAnswer;
handler.help = ['ماريو'];
handler.tags = ['game'];
handler.command = /^(ماريو|قفز)$/i;

export default handler;

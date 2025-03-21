const timeout = 20000; // 10 ثوانٍ
const points = 500;

const sentences = [
  "لوفي",
  "نانجي",
  "كيلرا",
  "ماجن بو",
  "غوكو"
  "رينغوكو"
  "نيزوكو"
  "اينوسكي"
  "غون"
  "هيسوكا"
  "زاراكي"

];

const handler = async (m, { conn }) => {
  conn.typingGame = conn.typingGame ? conn.typingGame : {};
  const id = m.chat;

  if (id in conn.typingGame) {
    conn.reply(m.chat, '*❌ لديك تحدي سرعة جاري بالفعل!*', m);
    throw false;
  }

  const sentence = sentences[Math.floor(Math.random() * sentences.length)];

  const caption = `
⌨ **تحدي سرعة الكتابة!**    
*✍️"${sentence}"*  
⏳ لديك *10 ثوانٍ* للإجابة!  
🎁 الجائزة: ${points} نقطة
  `;

  conn.typingGame[id] = {
    message: await conn.reply(m.chat, caption, m),
    answer: sentence,
    points: points,
    timeout: setTimeout(async () => {
      if (conn.typingGame[id]) {
        await conn.reply(m.chat, `❌ *انتهى الوقت!* 😢\n✅ *الجملة الصحيحة:* "${sentence}"`, conn.typingGame[id].message);
        delete conn.typingGame[id];
      }
    }, timeout),
  };
};

const checkAnswer = async (m, { conn }) => {
  const id = m.chat;
  if (!conn.typingGame || !(id in conn.typingGame)) return;

  const game = conn.typingGame[id];
  if (m.text.trim() === game.answer) {
    await conn.reply(m.chat, `🎉 *إجابة صحيحة!* ✅ ربحت ${game.points} نقطة!`, m);
    clearTimeout(game.timeout);
    delete conn.typingGame[id];
  } else {
    m.reply('❌ *إجابة خاطئة! تأكد من إعادة كتابة الجملة كما هي!*');
  }
};

handler.before = checkAnswer;
handler.help = ['تحدي_الكتابة'];
handler.tags = ['game'];
handler.command = /^(كت|كت)$/i;

export default handler;

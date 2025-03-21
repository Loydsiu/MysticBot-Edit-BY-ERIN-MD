import fs from 'fs';

const timeout = 60000; // 60 ثانية
const points = 500;
const imageFolder = './src/game/anime_characters/';

const handler = async (m, { conn }) => {
  conn.animeGuess = conn.animeGuess ? conn.animeGuess : {};
  const id = m.chat;

  if (id in conn.animeGuess) {
    conn.reply(m.chat, '*❐┃في تحدي شغال بالفعل! حاول تجاوب أولًا! ❌ ❯*', conn.animeGuess[id][0]);
    throw false;
  }

  // اختيار صورة عشوائية من المجلد
  const files = fs.readdirSync(imageFolder).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  if (files.length === 0) {
    return conn.reply(m.chat, '❌ لا توجد صور شخصيات في المجلد! الرجاء إضافة صور.', m);
  }

  const randomFile = files[Math.floor(Math.random() * files.length)];
  const characterName = randomFile.replace(/\.(jpg|jpeg|png)$/i, ''); // حذف امتداد الصورة

  const caption = `
ⷮ > ˼⚡˹↜ احزر اسم الشخصية ↶
╮───────────────────⟢ـ
┆❐↞┇الـوقـت⏳↞ ⌊${(timeout / 1000).toFixed(2)} ثانية⌉
┆❐↞┇الـجـائـزة💰↞ ⌊${points} دولار⌉
┆❐↞┇المطورين 🤖↞ ⌊لويد⌉
╯───────────────────⟢ـ
> اكتب اسم الشخصية الآن!
`.trim();

  conn.animeGuess[id] = {
    message: await conn.sendMessage(m.chat, { image: { url: imageFolder + randomFile }, caption }, m),
    answer: characterName.toLowerCase(), // تخزين الإجابة الصحيحة بحروف صغيرة
    points: points,
    timeout: setTimeout(async () => {
      if (conn.animeGuess[id]) {
        await conn.reply(m.chat, `*❮ ⌛┇انتهى الوقت!┇⌛❯*\n *❐↞┇الإجابة الصحيحة✅↞ ${characterName} ┇*`, conn.animeGuess[id].message);
        delete conn.animeGuess[id]; // حذف التحدي بعد انتهاء الوقت
      }
    }, timeout)
  };
};

// التحقق من الإجابة
const checkAnswer = async (m, { conn }) => {
  const id = m.chat;
  if (!conn.animeGuess || !(id in conn.animeGuess)) return; // إذا لم يكن هناك تحدي، تجاهل الرسالة

  const game = conn.animeGuess[id];
  if (m.text.toLowerCase() === game.answer) {
    await conn.reply(m.chat, `🎉 صحيح! ✅ لقد ربحت ${game.points} نقطة!`, m);
    clearTimeout(game.timeout); // إلغاء المؤقت إذا أجاب المستخدم
    delete conn.animeGuess[id]; // حذف اللعبة بعد الإجابة الصحيحة
  }
};

handler.before = checkAnswer; // ربط التحقق من الإجابة قبل كل رسالة

handler.help = ['احزر'];
handler.tags = ['game'];
handler.command = /^(احزر|احزر_الشخصية)$/i;

export default handler;

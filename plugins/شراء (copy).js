import fs from 'fs';

const timeout = 60000;
const poin = 500;

const handler = async (m, { conn, usedPrefix }) => {
  conn.tekateki = conn.tekateki ? conn.tekateki : {};
  const id = m.chat;

  if (id in conn.tekateki) {
    conn.reply(m.chat, '*❐┃في سؤال هنا يــا بــاكــا┃❌ ❯*', conn.tekateki[id][0]);
    throw false;
  }

  const tekateki = JSON.parse(fs.readFileSync(`./src/game/عكس.json`));
  const json = tekateki[Math.floor(Math.random() * tekateki.length)];

  const caption = `
ⷮ > ˼⚡˹↜ الــســؤال يــا روحــي↶
> الــســؤال↜ ˼${json.question}˹ 
╮───────────────────⟢ـ
┆❐↞┇الـوقـت⏳↞ ⌊${(timeout / 1000).toFixed(2)} ثانية⌉
┆❐↞┇الـجـائـزة💰↞ ⌊${poin} دولار⌉
┆❐↞┇المطورين 🤖↞ ⌊لويد⌉
╯───────────────────⟢ـ
> لويد بــوت
`.trim();

  conn.tekateki[id] = [
    await conn.reply(m.chat, caption, m), json,
    poin,
    setTimeout(async () => {
      if (conn.tekateki[id]) {
        await conn.reply(m.chat, `*❮ ⌛┇انتهي الوقت┇⌛❯*\n *❐↞┇الاجـابـة✅↞ ${json.response}┇*`, conn.tekateki[id][0]);
        delete conn.tekateki[id];
      }
    }, timeout)
  ];
};

handler.help = ['عكس'];
handler.tags = ['game'];
handler.command = /^(العكس|عكس)$/i;

export default handler;

const cars = ["🚗", "🏎️", "🚙", "🚕", "🚓"];
const points = 200;

const handler = async (m, { conn }) => {
  const userCar = cars[Math.floor(Math.random() * cars.length)];
  const botCar = cars[Math.floor(Math.random() * cars.length)];

  let raceTrackUser = `${userCar}💨💨💨`;
  let raceTrackBot = `${botCar}💨💨💨`;

  let winner = Math.random() > 0.5 ? "أنت" : "البوت";

  let caption = `
🏁 **سباق السيارات بدأ!** 🚦  
👤 **سيارتك:** ${raceTrackUser}  
🤖 **سيارة البوت:** ${raceTrackBot}  
🎉 **الفائز:** ${winner}
  `;

  if (winner === "أنت") {
    caption += `\n🏆 **ربحت ${points} نقطة!** 🎊`;
  } else {
    caption += `\n😢 **حظًا أوفر في المرة القادمة!**`;
  }

  await conn.reply(m.chat, caption, m);
};

handler.help = ['سباق_السيارات'];
handler.tags = ['game'];
handler.command = /^(سباق_السيارات|سباق)$/i;

export default handler;

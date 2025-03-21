const handler = async (m, { conn }) => {
    const challenges = [
        "😂 قلد صوت قطة لمدة 10 ثواني!",
        "💃 ارقص كما لو أن لا أحد يراك لمدة 5 ثواني!",
        "📢 قل أول كلمة تخطر في بالك الآن!",
        "🎭 مثل مشهد درامي من فيلم مشهور!",
        "🤪 أرسل رسالة عشوائية لأي شخص في جهات اتصالك!",
        "🎤 غني أغنيتك المفضلة بصوت عالي!",
        "🕺 قم بتنفيذ حركة الرقص المفضلة لديك!",
        "🎨 ارسم صورة عشوائية وأرسلها هنا!",
        "🎭 استخدم الفلتر الأكثر جنونًا لديك والتقط صورة!",
        "😆 حاول ألا تضحك لمدة 30 ثانية!"
    ];

    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];

    const buttons = [
        { buttonId: 'تحدي-جديد', buttonText: { displayText: '🎲 تحدي جديد' }, type: 1 },
        { buttonId: 'انسحاب', buttonText: { displayText: '🏃 انسحاب' }, type: 1 }
    ];

    const buttonMessage = {
        text: `🎭 *تحدي مضحك لك:*\n👉 ${randomChallenge}`,
        footer: "اضغط على زر 'تحدي جديد' للحصول على تحدي آخر!",
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.command = /^(ضحك)$/i;
export default handler;

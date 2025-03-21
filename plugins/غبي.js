import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    let flags = [
        { name: "أستراليا", code: "AU" },
        { name: "الأردن", code: "JO" },
        { name: "أرمينيا", code: "AM" },
        { name: "مصر", code: "EG" }
    ];

    // اختيار علم عشوائي
    let correctFlag = flags[Math.floor(Math.random() * flags.length)];
    let imageUrl = `https://flagcdn.com/w320/${correctFlag.code.toLowerCase()}.png`; // رابط صورة العلم

    // تحميل صورة العلم وتحويلها إلى Buffer
    let response = await fetch(imageUrl);
    let imageBuffer = await response.buffer();

    // إنشاء الأزرار
    let buttons = flags.map((flag, index) => ({
        buttonId: `guess_${flag.name}`, 
        buttonText: { displayText: `${index + 1}️⃣ ${flag.name}` }, 
        type: 1
    }));

    // إرسال الرسالة مع الصورة والأزرار
    await conn.sendMessage(m.chat, {
        image: imageBuffer,
        caption: `🎌 *خمن العلم!*`,
        footer: `⏳ لديك 60 ثانية\n🏆 الجائزة: 500 نقطة`,
        templateButtons: buttons,
        headerType: 4
    });

    // حفظ الإجابة الصحيحة في كائن لتتبع الإجابات
    conn.guessGame = conn.guessGame || {};
    conn.guessGame[m.chat] = {
        answer: correctFlag.name,
        userAnswered: false,
        timeout: setTimeout(() => {
            if (!conn.guessGame[m.chat].userAnswered) {
                conn.sendMessage(m.chat, { text: `⏳ انتهى الوقت! الإجابة الصحيحة هي: *${correctFlag.name}*` });
            }
            delete conn.guessGame[m.chat];
        }, 60000)
    };
};

handler.command = ['علم'];

// استقبال الإجابة والتحقق منها
handler.before = async (m, { conn }) => {
    if (!m.message || !m.message.buttonId) return;

    let game = conn.guessGame?.[m.chat];
    if (!game) return;

    let userAnswer = m.message.buttonId.replace("guess_", "");

    if (userAnswer === game.answer) {
        conn.sendMessage(m.chat, { text: `✅ صحيح! الإجابة هي *${game.answer}* 🎉` });
    } else {
        conn.sendMessage(m.chat, { text: `❌ خطأ! الإجابة الصحيحة هي *${game.answer}*` });
    }

    game.userAnswered = true;
    clearTimeout(game.timeout);
    delete conn.guessGame[m.chat];
};

export default handler;

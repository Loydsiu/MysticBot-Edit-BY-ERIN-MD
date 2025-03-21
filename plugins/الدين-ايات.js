import pkg from '@whiskeysockets/baileys'; 
const { delay } = pkg;

const handler = async (m, { conn }) => { 
    const ayat = [ 
        { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", surah: "البقرة - 153" },
        { text: "وَقُولُوا لِلنَّاسِ حُسْنًا", surah: "البقرة - 83" },
        { text: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ", surah: "الحجرات - 10" },
        { text: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", surah: "البقرة - 286" },
        { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", surah: "الشرح - 5" },
        { text: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا", surah: "الطلاق - 2" }
    ];

    const randomAyah = ayat[Math.floor(Math.random() * ayat.length)];
    const imageUrl = 'https://files.catbox.moe/a9eayg.jpg';

    try {
        // إرسال التفاعل 📖
        await conn.sendMessage(m.chat, { react: { text: '📖', key: m.key } });

        // تأخير بسيط لضمان تنفيذ التفاعل أولاً
        await delay(1000);

        // إرسال الصورة مع الآية القرآنية والأزرار
        await conn.sendMessage(m.chat, { 
            image: { url: imageUrl }, 
            caption: `📖 *آيــة قــرآنــيــة* 📖\n\n➤ *الآية:* "${randomAyah.text}"\n➤ *السورة:* ${randomAyah.surah}\n\n💡 *اضغط على الزر للحصول على آية أخرى*`,
            footer: "📌 بوت القرآن الكريم",
            buttons: [
                { buttonId: ".ايات", buttonText: { displayText: "آيــة أخــرى 📍" }, type: 1 },
                { buttonId: "channel", buttonText: { displayText: "قــنــاتــنــا 🎖️" }, type: 1 }
            ],
            headerType: 4
        });

    } catch (err) {
        console.error("❌ خطأ في إرسال الرسالة:", err);
        await conn.sendMessage(m.chat, { text: "❌ حدث خطأ أثناء إرسال الآية، حاول مرة أخرى لاحقًا." });
    }
};

handler.command = /^ايات$/i;

export default handler;

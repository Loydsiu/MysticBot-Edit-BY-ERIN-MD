import fs from 'fs';

// 🔹 ملف تخزين حالة الترحيب
const FILE_PATH = './welcomeGroups.json';

// 🔹 تحميل قائمة المجموعات عند بدء التشغيل
let welcomeGroups = new Set();
if (fs.existsSync(FILE_PATH)) {
    try {
        const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
        welcomeGroups = new Set(data);
    } catch (error) {
        console.error("⚠️ خطأ في قراءة ملف الترحيب:", error);
    }
}

// 🔹 حفظ حالة الترحيب في الملف
const saveWelcomeGroups = () => {
    fs.writeFileSync(FILE_PATH, JSON.stringify([...welcomeGroups]), 'utf-8');
};

// 🔹 أوامر التحكم في الترحيب
let handler = async (m, { conn, isAdmin, text }) => {
    if (!m.isGroup) 
        return conn.sendMessage(m.chat, { text: "❌ *هذا الأمر يعمل فقط في المجموعات!*" }, { quoted: m });

    if (!isAdmin) 
        return conn.sendMessage(m.chat, { text: "🚫 *يجب أن تكون مشرفًا لاستخدام هذا الأمر!*" }, { quoted: m });

    if (text === "ايقاف") {
        if (!welcomeGroups.has(m.chat)) 
            return conn.sendMessage(m.chat, { text: "⚠️ *الترحيب غير مفعّل بالفعل!*" }, { quoted: m });

        welcomeGroups.delete(m.chat);
        saveWelcomeGroups(); // حفظ التحديثات
        return conn.sendMessage(m.chat, { text: "🛑 *تم إيقاف الترحيب في هذه المجموعة.*" }, { quoted: m });
    }

    if (welcomeGroups.has(m.chat)) {
        return conn.sendMessage(m.chat, { text: "⚠️ *الترحيب مفعّل بالفعل!*" }, { quoted: m });
    }

    welcomeGroups.add(m.chat);
    saveWelcomeGroups(); // حفظ التحديثات
    return conn.sendMessage(m.chat, { text: "تست الأن شغال يا حب" }, { quoted: m });
};

handler.command = /^(ترحيب|ايقاف)$/i;
handler.group = true;
handler.admin = true;

export default handler;

// 🔹 الترحيب بالأعضاء الجدد تلقائيًا
global.conn.ev.on("group-participants.update", async (update) => {
    const { id, participants, action } = update;

    if (!welcomeGroups.has(id) || action !== "add") return;

    let imageUrl = 'https://qu.ax/LQfVY.png'; // صورة الترحيب

    try {
        let groupMetadata = await global.conn.groupMetadata(id);
        let groupDescription = groupMetadata.desc || "لا يوجد وصف لهذه المجموعة.";

        for (let participant of participants) {
            let username = `@${participant.split("@")[0]}`;
            let welcomeText = `*╭┈⊰* 🪻الــتــرحــيــب🪻 *⊰┈ ✦*\n`
                + `*┊˹📯˼┊ مـرحبـاً بــك*\n`
                + `┊˹🥷🏻˼┊ ${username}\n`
                + `┊📩 *اقــرأ وصــف الــمــجــمــوعــة*\n`
                  + `> *مــنــور الــقــروب انــا لـويـد┊˹💸˼┊*\n\n`
                  + `‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎`
                
                + `*👇🏻*\n\n`
                + `> *مــنــور الــقــروب انــا لـويـد┊˹💸˼┊*\n\n`
                + `📜 *الــوصــف:*\n${groupDescription}`;

            let message = {
                image: { url: imageUrl },
                caption: welcomeText,
                mentions: [participant],
                footer: '𝐋𝐎𝐘𝐃-𝐁𝐎𝐓',
            };

            await global.conn.sendMessage(id, message);
        }
    } catch (e) {
        console.log("⚠️ خطأ أثناء إرسال رسالة الترحيب:", e);
    }
});

import fs from 'fs';

// تحميل قائمة المجموعات من الملف أو إنشاء ملف جديد إذا لم يكن موجودًا
const goodbyeFile = './goodbyeGroups.json';
let goodbyeGroups = new Set();

if (fs.existsSync(goodbyeFile)) {
    try {
        goodbyeGroups = new Set(JSON.parse(fs.readFileSync(goodbyeFile, 'utf8')));
    } catch (error) {
        console.log("⚠️ خطأ في قراءة ملف المغادرة:", error);
    }
}

// دالة لحفظ المجموعات عند التحديث
const saveGoodbyeGroups = () => {
    fs.writeFileSync(goodbyeFile, JSON.stringify([...goodbyeGroups], null, 2));
};

let handler = async (m, { conn, isAdmin, text }) => {
    if (!m.isGroup) 
        return conn.sendMessage(m.chat, { text: "❌ *هذا الأمر يعمل فقط في المجموعات!*" }, { quoted: m });

    let groupMetadata;
    try {
        groupMetadata = await conn.groupMetadata(m.chat);
    } catch (error) {
        return conn.sendMessage(m.chat, { text: "⚠️ *حدث خطأ أثناء جلب بيانات المجموعة!*" }, { quoted: m });
    }

    if (!isAdmin) 
        return conn.sendMessage(m.chat, { text: "🚫 *يجب أن تكون مشرفًا لاستخدام هذا الأمر!*" }, { quoted: m });

    if (text === "ايقاف") {
        if (!goodbyeGroups.has(m.chat)) 
            return conn.sendMessage(m.chat, { text: "⚠️ *المغادرة غير مفعّلة بالفعل!*" }, { quoted: m });

        goodbyeGroups.delete(m.chat);
        saveGoodbyeGroups();
        return conn.sendMessage(m.chat, { text: "🛑 *تم إيقاف رسائل المغادرة في هذه المجموعة.*" }, { quoted: m });
    }

    if (goodbyeGroups.has(m.chat)) {
        return conn.sendMessage(m.chat, { text: "⚠️ *رسائل المغادرة مفعّلة بالفعل!*" }, { quoted: m });
    }

    goodbyeGroups.add(m.chat);
    saveGoodbyeGroups();
    return conn.sendMessage(m.chat, { text: "تست شغال يا حب" }, { quoted: m });
};

handler.command = /^(مغادره|ايقاف)$/i;
handler.group = true;
handler.admin = true;

export default handler;

// 🔹 مراقبة مغادرة الأعضاء وإرسال رسالة وداع
global.conn.ev.on("group-participants.update", async (update) => {
    const { id, participants, action } = update;

    if (!goodbyeGroups.has(id) || action !== "remove") return;

    let groupMetadata;
    try {
        groupMetadata = await global.conn.groupMetadata(id);
    } catch (error) {
        console.log("⚠️ حدث خطأ أثناء جلب بيانات المجموعة:", error);
        return;
    }

    let imageUrl = 'https://qu.ax/LQfVY.png'; // صورة مخصصة للمغادرة

    for (let participant of participants) {
        try {
            let username = `@${participant.split("@")[0]}`;
            let goodbyeText = `*╭┈⊰* 🪻 الــوداع 🪻 *⊰┈ ✦*\n`
                + `*┊👋🏻┊ مـع الـسـلامـة، نـتـمـنـى لـك الـتـوفـيـق!* \n`
                + `┊👤┊ ${username}\n`
                + `┊📩 *دز في ناس كثير تيجي مكانك* 🐦‍⬛☕️*`;

            let message = {
                image: { url: imageUrl },
                caption: goodbyeText,
                mentions: [participant],
                footer: '𝐋𝐎𝐘𝐃-𝐁𝐎𝐓',
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        mediaType: 1,
                        title: '𝐋𝐎𝐘𝐃-𝐁𝐎𝐓',
                        thumbnailUrl: imageUrl,
                        sourceUrl: 'https://chat.whatsapp.com/IoVOi6s5jwuFQzoEhmymfR',
                    },
                },
            };

            await global.conn.sendMessage(id, message);
        } catch (e) {
            console.log("⚠️ حدث خطأ أثناء إرسال رسالة المغادرة:", e);
        }
    }
});

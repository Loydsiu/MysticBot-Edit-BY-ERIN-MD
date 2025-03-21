import fs from 'fs';

// 🔹 ملف تخزين حالة الاستقبال
const FILE_PATH = './Lloyd.json';

// 🔹 تحميل قائمة المجموعات عند بدء التشغيل
let Lloyd = new Set();
if (fs.existsSync(FILE_PATH)) {
    try {
        const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
        Lloyd = new Set(data);
    } catch (error) {
        console.error("⚠️ خطأ في قراءة ملف الاستقبال:", error);
    }
}

// 🔹 حفظ حالة الاستقبال في الملف
const saveLloyd = async () => {
    try {
        await fs.promises.writeFile(FILE_PATH, JSON.stringify([...Lloyd]), 'utf-8');
    } catch (error) {
        console.error("⚠️ خطأ في حفظ حالة الاستقبال:", error);
    }
};

// 🔹 أوامر التحكم في الاستقبال
let handler = async (m, { conn, isAdmin, text }) => {
    if (!m.isGroup) 
        return conn.sendMessage(m.chat, { text: "❌ *هذا الأمر يعمل فقط في المجموعات!*" }, { quoted: m });

    if (!isAdmin) 
        return conn.sendMessage(m.chat, { text: "🚫 *يجب أن تكون مشرفًا لاستخدام هذا الأمر!*" }, { quoted: m });

    if (text === "ايقاف") {
        if (!Lloyd.has(m.chat)) 
            return conn.sendMessage(m.chat, { text: "⚠️ *الاستقبال غير مفعّل بالفعل!*" }, { quoted: m });

        Lloyd.delete(m.chat);
        await saveLloyd(); // حفظ التحديثات
        return conn.sendMessage(m.chat, { text: "🛑 *تم إيقاف الاستقبال في هذه المجموعة.*" }, { quoted: m });
    }

    if (Lloyd.has(m.chat)) {
        return conn.sendMessage(m.chat, { text: "⚠️ *الاستقبال مفعّل بالفعل!*" }, { quoted: m });
    }

    Lloyd.add(m.chat);
    await saveLloyd(); // حفظ التحديثات
    return conn.sendMessage(m.chat, { text: "✨ *تم تفعيل الاستقبال في هذه المجموعة!*" }, { quoted: m });
};

handler.command = /^(استقبال|ايقاف)$/i;
handler.group = true;
handler.admin = true;

export default handler;

// 🔹 الاستقبال بالأعضاء الجدد تلقائيًا
global.conn.ev.on("group-participants.update", async (update) => {
    const { id, participants, action } = update;

    if (!Lloyd.has(id) || action !== "add") return;

    let imageUrl = 'https://qu.ax/KwEoc.jpg'; // صورة الاستقبال

    try {
        let groupMetadata = await global.conn.groupMetadata(id);
        let groupDescription = groupMetadata.desc || "لا يوجد وصف لهذه المجموعة.";

        for (let participant of participants) {
            let username = `@${participant.split("@")[0]}`;
            let welcomeText = `*منور ذا مجرد بوت اذا خلصت الأستمارا منشن المشرفين وشكرا يا ${username}*\n\n`
                
                + `> *『║『استقبال⊰🌗 ⊱𝑴𝑶𝑶𝑵』』*

*املئ الإستمارة 🏆*

↧↧↧↧↧↧↧↧↧＝❀🌕❀＝↧↧↧↧↧↧
 ** 
 - *⸙ لقبك【 】* 
> _اختر اسم شخصية انمي تحبها وتكون مناسبة على جنسك_


 *⸙ من طرف مين【 】*
> يعني وقت دخلت كان مكتوب ايا لقب + اذا ما تتذكر ف قول صورة الحساب او من ايا تطبيق

↧↧↧↧↧↧↧↧↧＝❀🌕❀＝↧↧↧↧↧↧↧↧↧

> *『║『استقبال⊰🌗 ⊱𝑴𝑶𝑶𝑵』║』*`;

            + `*ملاحظه اذا خلصت منشن المشرفين*`;

            
            let message = {
                image: { url: imageUrl },
                caption: welcomeText,
                mentions: [participant],
                footer: '𝐋𝐎𝐘𝐃-𝐁𝐎𝐓',
            };

            await global.conn.sendMessage(id, message);
        }
    } catch (e) {
        console.log("⚠️ خطأ أثناء إرسال رسالة الاستقبال:", e);
    }
});

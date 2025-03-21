let activeGroups = {}; // تخزين حالة التفعيل لكل مجموعة

let handler = async (m, { conn, isBotAdmin, participants, text }) => {
    if (!m.isGroup) return; // يعمل فقط في المجموعات
    if (!isBotAdmin) return m.reply("❌ | يجب أن يكون البوت مشرفًا ليعمل هذا النظام.");

    let groupMetadata = await conn.groupMetadata(m.chat);
    let botNumber = conn.user.jid;
    let ownerNumber = groupMetadata.owner || '';

    // ✅ تفعيل النظام بكتابة "Loyd"
    if (text === "Loyd") {
        activeGroups[m.chat] = true;
        return m.reply("✅ | تم تفعيل نظام إزالة المشرفين في هذه المجموعة.");
    }

    // ❌ تعطيل النظام بكتابة "إلغاء Loyd"
    if (text === "إلغاء Loyd") {
        delete activeGroups[m.chat];
        return m.reply("❌ | تم تعطيل نظام إزالة المشرفين في هذه المجموعة.");
    }

    // ⚠️ إذا لم يتم تفعيل النظام في هذه المجموعة، لا يحدث شيء
    if (!activeGroups[m.chat]) return;

    // 👀 مراقبة ترقيات المشرفين
    if (m.messageStubType === 29) { // 29 = ترقية مشرف (في بعض الأنظمة يمكن أن يكون 'promote')
        let newAdmin = m.messageStubParameters[0] + "@s.whatsapp.net"; // رقم الشخص الذي تمت ترقيته

        // إرسال رسالة تنبيه
        m.reply(`🚨 | تم ترقية ${newAdmin} إلى مشرف! سيتم الآن إزالة جميع المشرفين باستثناء البوت والمؤسس.`);

        // جلب جميع المشرفين
        let admins = participants.filter(p => p.admin);

        for (let admin of admins) {
            if (admin.id !== botNumber && admin.id !== ownerNumber) {
                await conn.groupParticipantsUpdate(m.chat, [admin.id], "demote"); // إزالة المشرفين
            }
        }

        m.reply("✅ | تم إزالة جميع المشرفين باستثناء البوت والمؤسس.");
    }
};

handler.group = true; // يعمل فقط في المجموعات
handler.admin = true; // يجب أن يكون المستخدم مشرفًا لاستخدام الأمر
export default handler;

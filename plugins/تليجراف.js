let antiLinkGroups = new Set(); // قائمة المجموعات التي تم تفعيل منع الروابط فيها

let handler = async (m, { conn, isGroup, isAdmin, text }) => {
    if (!m.chat.endsWith("@g.us")) {
        return conn.reply(m.chat, "❌ هذا الأمر يعمل فقط داخل المجموعات!", m);
    }

    let groupMetadata;
    try {
        groupMetadata = await conn.groupMetadata(m.chat);
    } catch (error) {
        return conn.reply(m.chat, "⚠️ حدث خطأ أثناء جلب بيانات المجموعة!", m);
    }

    let participants = groupMetadata.participants;
    let sender = m.sender;
    let isSenderAdmin = participants.some(p => p.id === sender && (p.admin === "admin" || p.admin === "superadmin"));

    if (!isSenderAdmin) {
        return conn.reply(m.chat, "🚫 يجب أن تكون مشرفًا لاستخدام هذا الأمر!", m);
    }

    if (text === "ايقاف") {
        if (!antiLinkGroups.has(m.chat)) {
            return conn.reply(m.chat, "⚠️ ميزة منع الروابط غير مفعلة بالفعل!", m);
        }
        antiLinkGroups.delete(m.chat);
        return conn.reply(m.chat, "🛑 تم إيقاف ميزة منع الروابط في هذه المجموعة.", m);
    }

    if (antiLinkGroups.has(m.chat)) {
        return conn.reply(m.chat, "⚠️ ميزة منع الروابط مفعلة بالفعل!", m);
    }

    antiLinkGroups.add(m.chat);
    return conn.reply(m.chat, "✅ تم تفعيل ميزة منع الروابط في هذه المجموعة.", m);
};

handler.command = /^(روابط|ايقاف)$/i;
handler.admin = true;
handler.group = true;

export default handler;

// مراقبة الرسائل ومنع الروابط
conn.ev.on("messages.upsert", async ({ messages }) => {
    let m = messages[0];
    if (!m || !m.message || !m.key || m.key.remoteJid === "status@broadcast") return;

    let chatId = m.key.remoteJid;
    let senderId = m.key.participant || m.key.remoteJid;
    let isGroup = chatId.endsWith("@g.us");

    if (!isGroup || !antiLinkGroups.has(chatId)) return;

    let groupMetadata = await conn.groupMetadata(chatId);
    let participants = groupMetadata.participants;
    let isAdmin = participants.some(p => p.id === senderId && (p.admin === "admin" || p.admin === "superadmin"));

    if (isAdmin) return; // السماح للمشرفين بإرسال الروابط

    let messageText = m.message.conversation || m.message.extendedTextMessage?.text || "";
    let linkRegex = /(https?:\/\/[^\s]+)/gi;

    if (linkRegex.test(messageText)) {
        await conn.sendMessage(chatId, { text: `🚫 ممنوع إرسال الروابط، سيتم حذف الرسالة!` }, { quoted: m });
        await conn.sendMessage(chatId, { delete: m.key });
    }
});

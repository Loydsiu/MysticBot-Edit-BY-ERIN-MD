let protectedGroups = new Set(); // قائمة المجموعات المحمية

let handler = async (m, { conn, isGroup, isAdmin, text }) => {
    if (!m.isGroup) return conn.sendMessage(m.chat, { text: "❌ *هذا الأمر يعمل فقط في المجموعات!*" }, { quoted: m });
    let groupMetadata = await conn.groupMetadata(m.chat);
    let participants = groupMetadata.participants;
    let sender = m.sender;
    let isSenderAdmin = participants.find(p => p.id === sender)?.admin;

    if (!isSenderAdmin) return conn.sendMessage(m.chat, { text: "🚫 *يجب أن تكون مشرفًا لاستخدام هذا الأمر!*" }, { quoted: m });

    if (text === "ايقاف") {
        if (!protectedGroups.has(m.chat)) return conn.sendMessage(m.chat, { text: "⚠️ *الحماية غير مفعلة بالفعل!*" }, { quoted: m });
        protectedGroups.delete(m.chat);
        return conn.sendMessage(m.chat, { text: "🛑 *تم إيقاف الحماية في هذه المجموعة.*" }, { quoted: m });
    }

    protectedGroups.add(m.chat);
    return conn.sendMessage(m.chat, { text: "✅ *تم تفعيل الحماية!*\n🔒 *أي شخص يُصبح مشرفًا سيتم تنزيله فورًا.*" }, { quoted: m });
};

handler.command = /^(حماية|ايقاف)$/i;
handler.group = true;
handler.admin = true;

export default handler;

// مراقبة تغييرات المشرفين وتنزيل أي شخص يتم ترقيته
conn.ev.on("group-participants.update", async (update) => {
    const { id, participants, action } = update;

    if (!protectedGroups.has(id) || action !== "promote") return;

    for (let participant of participants) {
        let groupMetadata = await conn.groupMetadata(id);
        let admins = groupMetadata.participants.filter(p => p.admin === "admin" || p.admin === "superadmin");
        let botAdmin = admins.find(p => p.id === conn.user.jid);

        if (!botAdmin) {
            await conn.sendMessage(id, { text: "⚠️ *لا يمكن تطبيق الحماية لأن البوت ليس مشرفًا!*" });
            return;
        }

        if (participant !== conn.user.jid) {
            await conn.groupParticipantsUpdate(id, [participant], "demote");
            await conn.sendMessage(id, { 
                text: `🚨 *الحماية مفعلة!*\n👤 *المستخدم:* @${participant.split('@')[0]} تم تنزيله فورًا من المشرفين!`, 
                mentions: [participant] 
            });
        }
    }
});

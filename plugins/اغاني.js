let descriptionAlertGroups = new Set(); // قائمة المجموعات التي تم تفعيل التنبيه فيها

let handler = async (m, { conn, isGroup, isAdmin, text }) => {
    if (!m.chat.endsWith("@g.us")) return conn.sendMessage(m.chat, { text: "❌ *هذا الأمر يعمل فقط في المجموعات!*" }, { quoted: m });

    let groupMetadata;
    try {
        groupMetadata = await conn.groupMetadata(m.chat);
    } catch (error) {
        return conn.sendMessage(m.chat, { text: "⚠️ *حدث خطأ أثناء جلب بيانات المجموعة!*" }, { quoted: m });
    }

    let participants = groupMetadata.participants;
    let sender = m.sender;
    let isSenderAdmin = participants.some(p => p.id === sender && (p.admin === "admin" || p.admin === "superadmin"));

    if (!isSenderAdmin) return conn.sendMessage(m.chat, { text: "🚫 *يجب أن تكون مشرفًا لاستخدام هذا الأمر!*" }, { quoted: m });

    if (text === "ايقاف") {
        if (!descriptionAlertGroups.has(m.chat)) return conn.sendMessage(m.chat, { text: "⚠️ *تنبيه تغيير الوصف غير مفعّل بالفعل!*" }, { quoted: m });

        descriptionAlertGroups.delete(m.chat);
        return conn.sendMessage(m.chat, { text: "🛑 *تم إيقاف تنبيه تغيير الوصف في هذه المجموعة.*" }, { quoted: m });
    }

    if (descriptionAlertGroups.has(m.chat)) {
        return conn.sendMessage(m.chat, { text: "⚠️ *تنبيه تغيير الوصف مفعّل بالفعل!*" }, { quoted: m });
    }

    descriptionAlertGroups.add(m.chat);
    return conn.sendMessage(m.chat, { text: "✅ *تم تفعيل تنبيه تغيير الوصف!*" }, { quoted: m });
};

handler.command = /^(وصف|ايقاف)$/i;
handler.group = true;
handler.admin = true;

export default handler;

// مراقبة تغيير وصف المجموعة
conn.ev.on("groups.update", async (updates) => {
    for (let update of updates) {
        if (!update.id || !update.desc || !descriptionAlertGroups.has(update.id)) return;

        try {
            let groupMetadata = await conn.groupMetadata(update.id);
            let participants = groupMetadata.participants.map(p => p.id); // جميع الأعضاء
            let newDescription = update.desc; // الوصف الجديد

            let alertMessage = `🚨 *تم تغيير وصف المجموعة!* 🚨\n\n📝 *الوصف الجديد:*\n"${newDescription}"\n\n📢 *يرجى الانتباه!*`;

            await conn.sendMessage(update.id, { text: alertMessage, mentions: participants });
        } catch (error) {
            console.error("❌ خطأ أثناء جلب بيانات المجموعة:", error);
        }
    }
});

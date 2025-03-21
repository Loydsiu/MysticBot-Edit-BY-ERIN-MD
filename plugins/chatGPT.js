    import fs from 'fs';

    const DATA_FILE = './activeGroups.json';
    let activeGroups = new Set();

    // تحميل قائمة المجموعات المفعلة عند تشغيل البوت
    if (fs.existsSync(DATA_FILE)) {
        try {
            activeGroups = new Set(JSON.parse(fs.readFileSync(DATA_FILE)));
            console.log("✅ تم تحميل المجموعات المحفوظة:", activeGroups);
        } catch (error) {
            console.error('⚠️ فشل تحميل بيانات المجموعات:', error);
        }
    }

    const saveActiveGroups = () => {
        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify([...activeGroups]));
            console.log("💾 تم حفظ حالة المجموعات:", activeGroups);
        } catch (error) {
            console.error("❌ فشل في حفظ بيانات المجموعات:", error);
        }
    };

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

        if (text === "اقاف") {
            if (!activeGroups.has(m.chat)) return conn.sendMessage(m.chat, { text: "⚠️ *الميزة غير مفعّلة بالفعل!*" }, { quoted: m });
            activeGroups.delete(m.chat);
            saveActiveGroups();
            console.log(`🛑 تم إيقاف الميزة في المجموعة ${m.chat}`);
            return conn.sendMessage(m.chat, { text: "🛑 *تم إيقاف الميزة!*" }, { quoted: m });
        }

        if (activeGroups.has(m.chat)) {
            return conn.sendMessage(m.chat, { text: "⚠️ *الميزة مفعّلة بالفعل!*" }, { quoted: m });
        }

        activeGroups.add(m.chat);
        saveActiveGroups();
        console.log(`✅ تم تفعيل الميزة في المجموعة ${m.chat}`);
        return conn.sendMessage(m.chat, { text: "✅ *تم تفعيل الميزة!*\n📢 *LOYD*" }, { quoted: m });
    };

    handler.command = /^(شغال|اقاف)$/i;
    handler.group = true;
    handler.admin = true;
    export default handler;

    // مراقبة ترقيات وسحب الإشراف
    conn.ev.on("group-participants.update", async (update) => {
        const { id, participants, action } = update;
        if (!activeGroups.has(id) || (action !== "promote" && action !== "demote")) return;

        let groupMetadata;
        try {
            groupMetadata = await conn.groupMetadata(id);
        } catch (error) {
            console.log("⚠️ حدث خطأ أثناء جلب بيانات المجموعة:", error);
            return;
        }

        let groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
        let botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        let owner = groupMetadata.owner || null;
        let authorizedUsers = ['9647865818850@s.whatsapp.net', 'رقم2@s.whatsapp.net']; // أضف أرقام الأشخاص الذين لديهم صلاحيات

        let allowedAdmins = owner ? [owner, botNumber, ...authorizedUsers] : [botNumber, ...authorizedUsers];
        let adminsToRemove = groupAdmins.filter(admin => !allowedAdmins.includes(admin));

        if (adminsToRemove.length > 0) {
            console.log(`🚨 سحب الإشراف من: ${adminsToRemove}`);
            await conn.groupParticipantsUpdate(id, adminsToRemove, "demote");
            return conn.sendMessage(id, { text: "✅ *تم سحب الإشراف من الجميع باستثناء الأشخاص المصرح لهم!*" });
        }
    });

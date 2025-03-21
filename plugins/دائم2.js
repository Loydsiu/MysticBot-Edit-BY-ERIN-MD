import fs from 'fs';

let dbFile = './savedGroups.json';

let sendStartupMessage = async (conn) => {
    try {
        if (!fs.existsSync(dbFile)) return;
        let savedGroups = JSON.parse(fs.readFileSync(dbFile));

        let groupIds = Object.keys(savedGroups);
        if (groupIds.length === 0) return;

        for (let groupId of groupIds) {
            let metadata = await conn.groupMetadata(groupId).catch(() => null);
            if (!metadata) continue;

            let participants = metadata.participants.map(user => user.id);
            let message = `✅ *البوت شغال الآن!*\n\n🔹 *المطور:* @${conn.user.jid.split('@')[0]}\n📢 *للتواصل مع الدعم:* wa.me/${conn.user.jid.split('@')[0]}`;

            await conn.sendMessage(groupId, { text: message, mentions: participants });
        }

        console.log('✅ تم إرسال إشعار التشغيل للمجموعات المحفوظة.');
    } catch (error) {
        console.error('❌ خطأ أثناء إرسال الإشعار:', error);
    }
};

// استدعاء الدالة عند تشغيل البوت
global.sendStartupMessage = sendStartupMessage;

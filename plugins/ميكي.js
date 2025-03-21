import { WASocket } from '@adiwajshing/baileys';

const warningCount = {};
const maxWarnings = 3;

/**
 * التحقق مما إذا كان المستخدم أدمن في المجموعة
 * @param {WASocket} sock - جلسة بوت Baileys
 * @param {string} groupJid - معرف المجموعة
 * @param {string} sender - معرف المرسل
 * @returns {Promise<boolean>} - إرجاع صحيح إذا كان المستخدم أدمن
 */
const isAdmin = async (sock, groupJid, sender) => {
    const metadata = await sock.groupMetadata(groupJid);
    return metadata.participants.some(participant => participant.id === sender && participant.admin);
};

/**
 * مراقبة الرسائل في المجموعة لمنع الروابط
 * @param {WASocket} sock - جلسة بوت Baileys
 * @param {Object} msg - الرسالة المستلمة
 */
const monitorMessages = async (sock, msg) => {
    const { remoteJid, message, key } = msg;
    if (!message || !message.conversation) return;

    const text = message.conversation;
    const sender = key.participant || key.remoteJid;
    const isGroup = remoteJid.endsWith('@g.us');

    if (isGroup && text.match(/https?:\/\/\S+/)) {
        if (await isAdmin(sock, remoteJid, sender)) {
            await sock.sendMessage(remoteJid, { text: `✅ أنت أدمن، مسموح لك بإرسال الروابط.` }, { quoted: msg });
            return;
        }

        await sock.sendMessage(remoteJid, { text: `🚫 ممنوع إرسال الروابط!` }, { quoted: msg });
        await sock.chatModify({ delete: key }, remoteJid);

        warningCount[sender] = (warningCount[sender] || 0) + 1;

        if (warningCount[sender] >= maxWarnings) {
            await sock.groupParticipantsUpdate(remoteJid, [sender], 'remove');
            delete warningCount[sender];
        } else {
            await sock.sendMessage(remoteJid, { text: `⚠️ تحذير رقم ${warningCount[sender]}! بعد ${maxWarnings} مخالفات سيتم طردك.` }, { quoted: msg });
        }
    }
};

export { monitorMessages };

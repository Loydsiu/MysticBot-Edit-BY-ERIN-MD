let badWords = ['شتيمة1', 'خول', 'شتيمة3']; // أضف الكلمات الممنوعة هنا

let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
    if (!m.message) return;

    let text = m.message.conversation || m.message.extendedTextMessage?.text;
    if (!text) return;

    let foundBadWord = badWords.some(word => text.toLowerCase().includes(word));
    if (!foundBadWord) return;

    if (isAdmin) return; // لا يتم طرد المشرفين

    if (isBotAdmin) {
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        m.reply(`🚨 تم طرد ${m.sender.split('@')[0]} بسبب استخدام ألفاظ غير لائقة!`);
    } else {
        let mentionedJid = m.sender;
        await conn.sendMessage(m.chat, { text: `🚨 تم اكتشاف شتيمة! @${mentionedJid.split('@')[0]} استخدم ألفاظًا غير مناسبة. يرجى من المشرفين اتخاذ الإجراء المناسب.`, mentions: [mentionedJid] });
    }
};

handler.group = true; // يعمل تلقائيًا في المجموعات فقط
export default handler;

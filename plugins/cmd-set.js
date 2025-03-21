let lastDescriptions = {}; // تخزين وصف كل جروب

let handler = async (m, { conn, participants }) => {
    if (!m.isGroup) return; // يعمل فقط في الجروبات

    let chatId = m.chat;
    let newDescription = m.messageStubParameters?.[0] || "لا يوجد وصف جديد"; // الوصف الجديد
    let oldDescription = lastDescriptions[chatId] || "لا يوجد وصف سابق"; // استرجاع الوصف السابق

    if (newDescription === oldDescription) return; // إذا لم يتغير، لا تفعل شيئًا

    lastDescriptions[chatId] = newDescription; // تحديث الوصف المخزن

    let mentions = participants.map(p => p.id); // منشن للأعضاء

    let message = `📝 *تم تعديل وصف المجموعة!*  
📌 *الوصف السابق:*  
${oldDescription}  

📍 *الوصف الجديد:*  
${newDescription}  

📢 @everyone`;

    conn.sendMessage(chatId, { text: message, mentions }, { quoted: m });
};

handler.before = async (m, { conn }) => {
    if (m.messageStubType === 'GROUP_CHANGE_DESCRIPTION') {
        await handler(m, { conn, participants: (await conn.groupMetadata(m.chat)).participants });
    }
};

export default handler;

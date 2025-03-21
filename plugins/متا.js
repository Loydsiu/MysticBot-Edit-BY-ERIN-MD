let owner = '4917627174914@s.whatsapp.net'; // ضع هنا رقمك مع @s.whatsapp.net

let handler = async (m, { conn, isGroup }) => {
    if (m.sender !== owner) {
        return conn.reply(m.chat, '🚫 هذا الأمر مخصص لصاحب البوت فقط!', m);
    }

    // التأكد أن الأمر يُنفذ داخل مجموعة
    let groupMetadata;
    try {
        groupMetadata = await conn.groupMetadata(m.chat);
    } catch (error) {
        console.log("⚠️ خطأ في جلب بيانات المجموعة:", error);
        return conn.reply(m.chat, "⚠️ لا يمكن تنفيذ هذا الأمر، تأكد أن البوت مشرف في المجموعة.", m);
    }

    if (!groupMetadata) {
        return conn.reply(m.chat, "❌ لا يمكن العثور على بيانات المجموعة!", m);
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [owner], "promote"); // ترقية المالك إلى مشرف
        conn.reply(m.chat, `✅ تم ترقية @${owner.split('@')[0]} إلى مشرف!`, m, { mentions: [owner] });
    } catch (error) {
        console.error("⚠️ حدث خطأ أثناء الترقية:", error);
        conn.reply(m.chat, "⚠️ حدث خطأ أثناء الترقية، تأكد أن البوت مشرف بالمجموعة.", m);
    }
};

handler.command = /^(kanon)$/i; // الأمر الذي سيتم تفعيله

export default handler;

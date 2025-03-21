export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
    if (m.isBaileys && m.fromMe) return !0
    if (m.isGroup) return !1
    if (!m.message) return !0

    // إذا احتوت الرسالة على أحد الكلمات المحظورة
    if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') ||  m.text.includes('menu') ||  m.text.includes('estado') || m.text.includes('bots') || m.text.includes('deletebot') ||  m.text.includes('eliminarsesion') ||  m.text.includes('deletesesion') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0

    // التحقق من إعدادات البوت المحلية
    let chat = global.db.data.chats[m.chat]
    let user = global.db.data.users[m.sender]
    let bot = global.db.data.settings[this.user.jid] || {}
    const nn = 'https://chat.whatsapp.com/Har7Z8RPqDO0jZP2FeRApN'
    // إذا كانت ميزة "antiPrivate" مفعلة وليس المستخدم مالك البوت أو مالكه الرئيسي
    if (bot.antiPrivate && !isOwner && !isROwner) {
        await m.reply(`مرحبًا *@${m.sender.split`@`[0]}*, من غير المسموح باستخدام البوت في الرسائل الخاصة\n\n🚫 يرجى عدم استخدام أوامر البوت في الرسائل الخاصة 🚫\n\nلاستخدام البوت، يجب الانضمام إلى مجموعة البوت الرسمية\n${nn}`, false, { mentions: [m.sender] })
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'banchat')
        return !1
    }
}

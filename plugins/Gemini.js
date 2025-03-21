let handler = async (m, { conn, groupMetadata }) => {
    let em = ['😀', '😂', '🍑', '😍', '🤤', '🥵', '😐', '🙂', '😎', '👻', '💩', '🥴', '🤑', '🤓']

    let toM = a => '@' + a.split('@')[0]

    // التأكد من وجود بيانات المجموعة
    if (!groupMetadata || !groupMetadata.participants || groupMetadata.participants.length === 0) {
        return m.reply('⚠️ لا يمكن العثور على بيانات المجموعة أو لا يوجد أعضاء.')
    }

    let participants = groupMetadata.participants.map(v => v.id)
    let randomUser = participants[Math.floor(Math.random() * participants.length)]
    let randomEmoji = em[Math.floor(Math.random() * em.length)]

    let message = `ولكن ليس بقدر ${toM(randomUser)} ${randomEmoji}`

    // إرسال الرسالة مع زر الرابط
    let buttons = [
        { buttonId: 'group_link', buttonText: { displayText: '🔗 رابط المجموعة' }, type: 1 }
    ]

    let buttonMessage = {
        text: message,
        footer: 'انضم إلى المجموعة الآن!',
        buttons: buttons,
        headerType: 1
    }

    let sendMsg = await conn.sendMessage(m.chat, buttonMessage, { mentions: [randomUser] })

    // عند الضغط على الزر، يتم إرسال رابط المجموعة
    conn.ev.on('messages.upsert', async ({ messages }) => {
        let msg = messages[0]
        if (!msg.message || msg.key.remoteJid !== m.chat) return
        let buttonReply = msg.message.buttonsResponseMessage
        if (buttonReply && buttonReply.selectedButtonId === 'group_link') {
            await conn.sendMessage(m.chat, { text: '🔗 رابط المجموعة: https://chat.whatsapp.com/IoVOi6s5jwuFQzoEhmymfR' })
        }
    })
}

handler.customPrefix = /^(سهل|إنه سهل|انه سهل|هو سهل|هي سهل|قوي|قويه|قوية|قوى|افضل|انا افضل منك|انا قوي|افضل واحد|اكثر متفاعل|اكثر متهور|اكثر مشاكل|اكبر مشكلة|اكبر مشكله|اقل واحد|اقل|متفاعل|يتفاعلو)/i
handler.command = new RegExp
handler.tags = ['fun']

export default handler

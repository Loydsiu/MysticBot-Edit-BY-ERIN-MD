
let handler = async (m, { conn, args, groupMetadata}) => {
        let who
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
        else who = m.chat
        if (!who) throw `✳️ منشن الشخص `
        if (!(who in global.db.data.users)) throw `✳️ المستخدم مفقود من قاعدة البيانات الخاصة بي`
       let warn = global.db.data.users[who].warn
       if (warn > 0) {
         global.db.data.users[who].warn -= 1
         m.reply(`⚠️ *تحذير*
         
▢ التحزير: *-1*
▢ مجموع التحزيرات: *${warn - 1}*`)
         m.reply(`✳️ قام أحد المشرفين بتخفيض تحذيره، والآن قمت بذلك *${warn - 1}*`, who)
         } else if (warn == 0) {
            m.reply('✳️ المستخدم ليس لديه تحذير')
        }

}
handler.help = ['delwarn @user']
handler.tags = ['group']
handler.command = ['حزف-التحزير', 'الغاء-التحزير'] 
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

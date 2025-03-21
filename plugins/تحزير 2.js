
let war = global.maxwarn
let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {      
        let who
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
        else who = m.chat
        if (!who) throw `✳️ منشن الي هتدله تحزير\n\n📌 مثال : ${usedPrefix + command} @user`
        if (!(who in global.db.data.users)) throw `✳️ 
المستخدم مفقود من قاعدة البيانات الخاصة بي`
        let name = conn.getName(m.sender)
        let warn = global.db.data.users[who].warn
        if (warn < war) {
            global.db.data.users[who].warn += 1
            m.reply(`
⚠️ *تحذير المستخدمين* ⚠️

▢ *مشرف:* ${name}
▢ *مستخدم:* @${who.split`@`[0]}
▢ *تحذير:* ${warn + 1}/${war}
▢ *سبب:* ${text}`, null, { mentions: [who] }) 
            m.reply(`
⚠️ *تحزير* ⚠️
لقد تلقيت تحذيرا من المشرف

▢ *تحزير:* ${warn + 1}/${war} 
اذا قبلت *${war}* تحذير بأنه سيتم إزالتك تلقائيا من المجموعة`, who)
        } else if (warn == war) {
            global.db.data.users[who].warn = 0
            m.reply(`⛔ المستخدم يتجاوز عدد التحذيرات *${war}* الان يجب حذفه`)
            await time(3000)
            await conn.groupParticipantsUpdate(m.chat, [who], 'ازاله')
            m.reply(`♻️ لقد تم إقصاؤك من المجموعة *${groupMetadata.subject}* أنه تم تحذيرك *${war}* kali`, who)
        }
}
handler.help = ['warn @user']
handler.tags = ['group']
handler.command = ['تحزير'] 
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

const time = async (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

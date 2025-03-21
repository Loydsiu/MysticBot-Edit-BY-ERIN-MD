import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix }) => {
let pp = 'https://qu.ax/JkCWF.jpg'
//const pp = await conn.profilePictureUrl(conn.user.jid).catch(_ => './src/avatar_contact.png')
let user = global.db.data.users[m.sender]
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
try {
pp = await conn.getProfilePicture(who)         //pp = await conn.getProfilePicture(who)
} catch (e) {

} finally {
let { name, limit, lastclaim, registered, regTime, age } = global.db.data.users[who]
//let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let prem = global.prems.includes(who.split`@`[0])
let sn = createHash('md5').update(who).digest('hex')
let str =
`┏━━°❀❬ *بروفايل العظمة* ❭❀°━━┓
┃ *🔥 الاسم 🔥 :* ${name}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *✨ الرقم ✨ :* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *🔰 المعرف 🔰 :* wa.me/${who.split`@`[0]}${registered ?'\n┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃ العمر ' + age + ' *سنة*' : ''}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *💎 الحد 💎 :* *${limit}* من الاستخدام
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *❇️ مسجل :* ${user.registered === true ? '✅' : '❌ .تسجيل'}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *❇️ بريميوم :* ${user.premiumTime > 0 ? '✅' : '❌ _#pase premium_'}
┗━━━━━━━━━━━━━━`.trim()
    conn.sendFile(m.chat, pp, 'pp.jpg', str, m, false, { contextInfo: { mentionedJid }})
  }
}
handler.help = ['profile [@user]']
handler.tags = ['xp']
handler.command = /^انا|بروفايل$/i
export default handler

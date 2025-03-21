import { createHash } from 'crypto'
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = db.data.users[m.sender]
  let name2 = conn.getName(m.sender)
  if (user.registered === true) throw `${iig}انت مسجل بلفعل\nإذا كنت تريد إلغاء التسجيل ، فاستخدم هذا الأمر\n*${usedPrefix}unreg الرقم التسلسلي*\n إذا كنت لا تتذكر الرقم التسلسلي الخاص بك ، فاستخدم هذا الأمر\n*${usedPrefix}myns*`
  if (!Reg.test(text)) throw `⚠️ استخدم الأمر : *${usedPrefix + command} nombre.edad*\n📌مثل\n: *${usedPrefix + command}* ${name2}.16`
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw ' لا يمكن أن يكون الاسم فارغ'
  if (!age) throw 'العمر لا يمكن أن يكون فارغا'
  if (name.length >= 30) throw 'يا حبيبي وش فيك اسمك يحتاج له صفحه كامله اكتب مليح ولا اضربك في شبشب' 
  age = parseInt(age)
  if (age > 100) throw 'يا ختيار عمرك لازم يكون أقل من 100'
  if (age < 5) throw 'من متا أطفال يعرفو يكتبو '
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date
  user.registered = true
global.db.data.users[m.sender].money += 800
global.db.data.users[m.sender].limit += 6
global.db.data.users[m.sender].exp += 305
global.db.data.users[m.sender].joincount += 4
  let sn = createHash('md5').update(m.sender).digest('hex')
let caption = `╭━━━[ *تسجيل* ]━━━━⬣
┃ *رقم* 
┃ ${name}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *العمر* 
┃ *${age} سنه*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *بونو* 
┃ *$350 خبره*
┃ *$200 كوينز*
┃ *$2 الماس*
╰━━━━━━━━━━━━━━━━━━⬣`
//let author = global.author
await conn.sendButton(m.chat, caption, `الرقم التسلسلي الخاص بك سوف يخدمك في حالة رغبتك في حذف تسجيلك \nمثل\n${usedPrefix}unreg الرقم التسلسلي\n${wm}`, [['ملفي✅', '/profile']], m)
await m.reply(`${sn}`) 
}
handler.help = ['daftar', 'register'].map(v => v + ' <nama>.<umur>')
handler.tags = ['xp']

handler.command = /^(verify|verificar|تسجيل|reg(ister)?)$/i

export default handler

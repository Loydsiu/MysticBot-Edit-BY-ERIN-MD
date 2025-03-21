let handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  let imageUrl = 'https://qu.ax/kPLgg.jpg' // رابط الصورة
  let pesan = args.join(' ') || "👥 منشن جماعي لجميع الأعضاء!" // رسالة افتراضية
  let oi = `*📩┇الـرسـالـه :* ${pesan}`
  let teks = `*『👑┇مــنــشــن┋🐦‍⬛☕️┋مــن عــمــك لــويــد┇👑』* \n\n ${oi}\n\n`

  let owner = null;
  let admins = [];
  let members = [];

  for (let mem of participants) {
    if (mem.admin === 'superadmin') {
      owner = mem.id;
    } else if (mem.admin) {
      admins.push(mem.id);
    } else {
      members.push(mem.id);
    }
  }

  if (owner) {
    teks += `*👑┇الـمـؤسس :*\n`
    teks += `*💎↫* @${owner.split('@')[0]}\n\n`
  }

  if (admins.length > 0) {
    teks += `*🌓┇الـمـشـرفـيـن :*\n`
    for (let admin of admins) {
      teks += `*🌗↫* @${admin.split('@')[0]}\n`
    }
  }

  if (members.length > 0) {
    teks += `\n*🌗┇الأعـضـاء :*\n`
    for (let member of members) {
      teks += `*🌗↫* @${member.split('@')[0]}\n`
    }
  }

  teks += `\n\n*_____________L_O_Y_D____________*\n`

  let mentions = owner ? [owner, ...admins, ...members] : [...admins, ...members];

  try {
    await conn.sendMessage(m.chat, { 
      image: { url: imageUrl }, // إرسال الصورة
      caption: teks, // إضافة النص أسفل الصورة
      mentions: mentions 
    }, { quoted: m })
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: "❌ حدث خطأ أثناء إرسال المنشن بالصورة." }, { quoted: m })
  }
}

handler.help = ['tagall']
handler.tags = ['group']
handler.command = ['tagall', 'منشن']
handler.group = true
handler.admin = true

export default handler;

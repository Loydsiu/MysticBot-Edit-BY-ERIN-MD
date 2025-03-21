let handler = async (m, { conn, text, participants }) => {
  let ownerNumber = '4917672339436@s.whatsapp.net'; // ✅ ضع رقمك هنا مع @s.whatsapp.net

  if (m.sender !== ownerNumber) {
      return conn.reply(m.chat, "🚫 *هذا الأمر مخصص لصاحب البوت فقط!*", m);
  }

  let args = text.trim();
  if (!args || isNaN(args)) return conn.reply(m.chat, "❌ *يرجى تحديد عدد الأعضاء الذين تريد طردهم.*", m);

  let numToKick = parseInt(args);
  let groupMetadata = await conn.groupMetadata(m.chat);
  let totalMembers = groupMetadata.participants.length;

  if (numToKick <= 0 || numToKick >= totalMembers) return conn.reply(m.chat, `❌ *لا يمكنك طرد هذا العدد. عدد الأعضاء الحالي: ${totalMembers}*`, m);

  let membersToKick = participants
      .filter(p => !p.admin && p.id !== conn.user.jid) // استبعاد المشرفين والبوت
      .map(p => p.id);

  if (membersToKick.length < numToKick) return conn.reply(m.chat, `❌ *عدد الأعضاء غير المشرفين أقل من العدد المطلوب!*`, m);

  let selectedToKick = membersToKick.sort(() => 0.5 - Math.random()).slice(0, numToKick);

  for (let user of selectedToKick) {
      await conn.groupParticipantsUpdate(m.chat, [user], "remove");
      await new Promise(resolve => setTimeout(resolve, 2000)); // مهلة بين الطرد
  }

  let remainingMembers = (await conn.groupMetadata(m.chat)).participants.length;

  await conn.sendMessage(m.chat, { text: `✅ *تم طرد ${numToKick} عضوًا بنجاح!*\n👥 *عدد الأعضاء المتبقين في المجموعة:* ${remainingMembers}` }, { quoted: m });
};

handler.command = /^(ا)$/i;
handler.group = true;
handler.botAdmin = true; // يجب أن يكون البوت مشرفًا

export default handler;

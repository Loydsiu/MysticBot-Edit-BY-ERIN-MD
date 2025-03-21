const handler = async (m, { conn, participants }) => {
  if (!m.isGroup) return;

  let mentionedJids = participants.map(p => p.id).filter(id => id !== conn.user.jid);
  if (mentionedJids.length === 0) return;

  await conn.sendMessage(m.chat, { text: '*زووووووووووووووووووووووط😂🫵🏻*', mentions: mentionedJids }, { quoted: m });
};

handler.command = /^(ها)$/i; // استبدل "كلمة-المنشن" بالكلمة التي تريدها
handler.group = true;
handler.rowner = true
export default handler;

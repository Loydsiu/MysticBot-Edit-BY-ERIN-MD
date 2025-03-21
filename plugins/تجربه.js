let handler = async (m, { conn, participants }) => {
  try {
      if (!m.isGroup) return await conn.sendMessage(m.chat, { text: "❌ هذا الأمر يعمل فقط داخل المجموعات!" }, { quoted: m });

      let groupId = m.chat; // معرف الجروب
      let groupMetadata = await conn.groupMetadata(m.chat); // جلب معلومات المجموعة
      let groupName = groupMetadata.subject; // اسم الجروب

      let message = `📌 *معرف هذه المجموعة:*\n\`${groupId}\`\n\n📝 *اسم المجموعة:*\n${groupName}`;

      await conn.sendMessage(m.chat, { text: message }, { quoted: m });
  } catch (error) {
      console.error(error);
      await conn.sendMessage(m.chat, { text: "⚠️ حدث خطأ أثناء جلب معرف المجموعة!" }, { quoted: m });
  }
};

handler.command = /^(معرف_الجروب|جروب)$/i;
export default handler;

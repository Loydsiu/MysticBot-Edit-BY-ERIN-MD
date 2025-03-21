let owner = '4917672339436@s.whatsapp.net'; // ضع هنا رقمك مع @s.whatsapp.net

let handler = async (m, { conn }) => {
    if (m.sender !== owner) {
        return conn.reply(m.chat, '🚫 هذا الأمر مخصص لصاحب البوت فقط!', m);
    }

    conn.reply(m.chat, '*𝐋𝐎𝐘𝐃 𝐅𝐑𝐎𝐍𝐓𝐄𝐑𝐀 𝐈𝐓\'𝐒 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃*', m);
};

handler.command = /^(بوت)$/i; // الأمر الذي سيتم تفعيله

export default handler;

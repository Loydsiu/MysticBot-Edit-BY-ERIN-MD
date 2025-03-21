let handler = async (m, { conn }) => {
    let chat = db.data.chats[m.chat];
    if (!chat.dailyTotal) chat.dailyTotal = {}; 
    let dailyCounts = chat.dailyTotal;

    let sortedData = Object.entries(dailyCounts).sort((a, b) => b[1] - a[1]);
    let totalMessages = sortedData.reduce((acc, [, total]) => acc + total, 0);
    let totalUsers = sortedData.length;

    let pesan = sortedData
        .map(([jid, total], index) => `*${index + 1}.* ${jid.replace(/(\d+)@.+/, '@$1')}: *${total}* رسالة`)
        .join('\n');

    let caption = `📊 *إجمالي الرسائل اليوم*: *${totalMessages}* رسالة من *${totalUsers}* شخص\n\n${pesan}`;

    let imageUrl = 'https://qu.ax/LQfVY.png'; // رابط الصورة (استبدله بصورة مناسبة)

    await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: caption }, { quoted: m });
};

handler.help = ['dailychat'];
handler.tags = ['group'];
handler.command = /^اليوم$/i;
handler.admin = true;
handler.group = true;

handler.before = function (m) {
    if (!m.isGroup) return false;

    let chat = db.data.chats[m.chat];
    if (!chat.dailyTotal) chat.dailyTotal = {};

    let today = new Date().toISOString().split('T')[0]; 
    if (chat.lastReset !== today) {
        chat.dailyTotal = {}; 
        chat.lastReset = today;
    }

    let sender = m.sender;
    if (!chat.dailyTotal[sender]) chat.dailyTotal[sender] = 0;
    chat.dailyTotal[sender] += 1;
};

export default handler;

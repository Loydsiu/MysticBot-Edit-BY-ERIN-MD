let handler = async (m, { conn, mentionedJid }) => {
    if (!mentionedJid || mentionedJid.length < 2) {
        return m.reply('💡 الرجاء منشن شخصين لتزويجهما.');
    }

    let [user1, user2] = mentionedJid;

    global.db.data.users = global.db.data.users || {};
    global.db.data.users[user1] = global.db.data.users[user1] || {};
    global.db.data.users[user2] = global.db.data.users[user2] || {};

    if (global.db.data.users[user1].pasangan || global.db.data.users[user2].pasangan) {
        return m.reply('❌ أحد المستخدمين لديه شريك بالفعل!');
    }

    global.db.data.users[user1].pasangan = user2;
    global.db.data.users[user2].pasangan = user1;

    let name1 = await conn.getName(user1);
    let name2 = await conn.getName(user2);

    m.reply(`💍 *مبروك!* 🎉\n${name1} ❤️ ${name2}\nنتمنى لكم السعادة الدائمة!`);
};

handler.help = ['زوج @شخص|@شخص'];
handler.tags = ['fun'];
handler.command = ['زوج'];

export default handler;
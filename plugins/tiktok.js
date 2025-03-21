import similarity from 'similarity';
const threshold = 0.72;

let handler = m => m;

handler.before = async function (m) {
    let id = m.chat;

    // التأكد أن الرسالة تنتمي لهذه اللعبة فقط
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/^ⷮ/i.test(m.quoted.text)) return !0;

    // التأكد أن اللعبة جارية في هذا الشات
    this.tekateki = this.tekateki ? this.tekateki : {};
    if (!(id in this.tekateki)) return m.reply('*❌ هذا السؤال قد انتهى، حاول مرة أخرى!*');

    // التأكد أن الرد يتعلق بالسؤال الحالي فقط
    if (m.quoted.id === this.tekateki[id][0].id) {
        let json = JSON.parse(JSON.stringify(this.tekateki[id][1]));

        if (m.text.toLowerCase() === json.response.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tekateki[id][2];
            m.reply(`🎉 *إجابة صحيحة!* ✅\n\n💰 *الجائزة:* ${this.tekateki[id][2]} نقطة!`);
            clearTimeout(this.tekateki[id][3]);
            delete this.tekateki[id];
        } else if (similarity(m.text.toLowerCase(), json.response.toLowerCase().trim()) >= threshold) {
            m.reply('🧐 *اقتربت من الإجابة!*');
        } else {
            m.reply('❌ *إجابة خاطئة!* حاول مرة أخرى.');
        }
    }
    return !0;
};

handler.exp = 0;
export default handler;

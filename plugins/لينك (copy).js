import { Chess } from 'chess.js';

let handler = async (m, { conn, usedPrefix }) => {
    conn.chessGames = conn.chessGames ? conn.chessGames : {};
    const id = m.chat;

    // إذا كانت هناك لعبة شطرنج قيد التشغيل بالفعل في هذه الدردشة
    if (id in conn.chessGames) {
        return conn.reply(m.chat, '❐┃لعبة شطرنج قيد التشغيل حاليا!❌', m);
    }

    // إنشاء لعبة شطرنج جديدة
    const game = new Chess();
    conn.chessGames[id] = game;

    // عرض الرقعة في البداية
    const showBoard = () => {
        const board = game.board();
        let boardText = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                boardText += board[row][col] ? board[row][col].type.toUpperCase() : '⬜';
            }
            boardText += '\n';
        }
        return boardText;
    };

    // إرسال رسالة بدء اللعبة
    const caption = `
تم بدء لعبة شطرنج جديدة!
استخدم التنسيق التالي لإرسال الحركات: "e2 e4" (من المربع إلى المربع).
المجموعة: ${id}
حظاً سعيداً!
`.trim();

    conn.reply(m.chat, caption, m);

    // إرسال الرقعة في البداية
    conn.reply(m.chat, `حالة الشطرنج الحالية:\n\n${showBoard()}`, m);

    // استقبال الحركات
    conn.on('message', async (message) => {
        if (message.chat !== id) return;

        const move = message.text.trim().toLowerCase();

        if (!move.match(/[a-h][1-8] [a-h][1-8]/)) {
            return conn.reply(m.chat, '❐┃حركة غير صحيحة، الرجاء إرسال الحركات بهذا التنسيق: "e2 e4" (من المربع إلى المربع).', m);
        }

        const [from, to] = move.split(' ');

        // تنفيذ الحركة
        const result = game.move({ from, to });

        if (result === null) {
            return conn.reply(m.chat, '❐┃الحركة غير قانونية، الرجاء المحاولة مرة أخرى!', m);
        }

        // عرض الرقعة بعد الحركة
        const gameState = game.game_over() ? '*❐┃انتهت اللعبة!🎉*' : `حالة الشطرنج بعد حركتك:\n\n${showBoard()}`;

        conn.reply(m.chat, gameState, m);

        // في حال انتهاء اللعبة
        if (game.game_over()) {
            delete conn.chessGames[id];
            conn.reply(m.chat, "*❐┃اللعبة انتهت! يمكنك بدء لعبة جديدة بإرسال أمر جديد.*", m);
        }
    });
};

handler.help = ['شطرنج'];
handler.tags = ['game'];
handler.command = /^(شطرنج)$/i;

export default handler;

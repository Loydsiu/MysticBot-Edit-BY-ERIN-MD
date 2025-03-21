import fetch from 'node-fetch';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import { exec } from 'child_process';

let handler = async (m, { conn, text }) => {
    if (!text) throw '🔍 يرجى إدخال اسم الرواية التي تريد البحث عنها';

    let searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(text)}&maxResults=5`;
    let res = await fetch(searchUrl);
    let json = await res.json();

    if (!json.items) throw '❌ لم يتم العثور على نتائج، حاول مرة أخرى باسم مختلف';

    let options = json.items.map((book, index) => {
        let title = book.volumeInfo.title;
        let author = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "مجهول";
        return `📖 *${index + 1}.* ${title} - ${author}`;
    }).join('\n');

    let replyText = `🔍 نتائج البحث عن: *${text}*\n\n${options}\n\n💾 أرسل الرقم (1-5) لتحميل الرواية بصيغة PDF.`;

    conn.reply(m.chat, replyText, m);

    conn.once('chat-update', async (message) => {
        if (!message.message) return;
        let choice = parseInt(message.message.conversation);
        if (isNaN(choice) || choice < 1 || choice > 5) return;

        let selectedBook = json.items[choice - 1];
        let pdfLink = selectedBook.accessInfo.pdf?.downloadLink;
        if (!pdfLink) return conn.reply(m.chat, '❌ لا يوجد ملف PDF متاح لهذه الرواية.', m);

        let pdfRes = await fetch(pdfLink);
        let buffer = await pdfRes.buffer();
        let filePath = `./${selectedBook.volumeInfo.title}.pdf`;

        await writeFile(filePath, buffer);
        conn.sendMessage(m.chat, { document: fs.readFileSync(filePath), mimetype: 'application/pdf', fileName: selectedBook.volumeInfo.title + '.pdf' }, { quoted: m });

        fs.unlinkSync(filePath); // حذف الملف بعد الإرسال
    });
};

handler.command = ['روايات'];
export default handler;

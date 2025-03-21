import { toAudio } from '../lib/converter.js';

let handler = async (m, { conn, usedPrefix, command }) => {
    let quotedMsg = m.quoted ? m.quoted : m;
    let mimeType = (m.quoted ? m.quoted : m).mimetype || '';

    // التحقق مما إذا كان الوسائط فيديو أو صوت
    if (!/video|audio/.test(mimeType)) 
        throw '✳️ قم بالرد على فيديو باستخدام أمر *.لصوت*';

    // تحميل بيانات الفيديو أو الصوت
    let mediaData = await quotedMsg.download?.();
    if (!mediaData && !/video/.test(mimeType)) 
        throw '✳️ قم بالرد على فيديو باستخدام *.لصوت*';

    if (!mediaData && !/audio/.test(mimeType)) 
        throw '✳️ قم بالرد على فيديو باستخدام *.لصوت*';

    // تحويل الفيديو إلى صوت
    let audioBuffer = await toAudio(mediaData, 'mp3');

    if (!audioBuffer.data && !/audio/.test(mimeType)) 
        throw '✳️ قم بالرد على فيديو باستخدام *.لصوت*';

    if (!audioBuffer.data && !/video/.test(mimeType)) 
        throw '✳️ قم بالرد على فيديو باستخدام *.لصوت*';

    // إرسال الملف الصوتي إلى المستخدم
    conn.sendFile(m.chat, audioBuffer.data, 'audio.mp3', '', m, null, { mimetype: 'audio/mp4' });
};

handler.help = ['لصوت'];
handler.tags = ['download'];
handler.command = ['tomp3', 'لصوت'];

export default handler;

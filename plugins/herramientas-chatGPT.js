import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
  try {
    // التحقق من أن المرسل قد أرسل فيديو
    if (!m.hasMedia) {
      return m.reply("❌ الرجاء إرسال فيديو لتحويله إلى MP3.");
    }

    // تنزيل الفيديو من WhatsApp
    const video = await conn.downloadAndSaveMediaMessage(m);

    // تحديد مسار الإخراج لملف MP3
    const outputPath = path.join(__dirname, 'output.mp3');

    // تحويل الفيديو إلى MP3 باستخدام ffmpeg
    ffmpeg(video)
      .audioCodec('libmp3lame')
      .format('mp3')
      .on('end', () => {
        console.log('تم تحويل الفيديو إلى MP3 بنجاح!');
      })
      .save(outputPath);

    // إرسال الملف بعد تحويله
    ffmpeg(video).on('end', async () => {
      await conn.sendFile(m.chat, outputPath, 'audio.mp3', '🎵 إليك ملف الـ MP3 من الفيديو.', m);
      // حذف الملف بعد إرساله
      fs.unlinkSync(outputPath);
    });

  } catch (error) {
    console.error(error);
    m.reply("❌ حدث خطأ أثناء تحويل الفيديو إلى MP3.");
  }
};

handler.command = /^(تحويل)$/i;  // يتم استدعاؤه عند كتابة "تحويل إلى mp3"
export default handler;

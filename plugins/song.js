import fetch from 'node-fetch';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('🌺 ادخل النص الذي تريد البحث عن صوره 🌺');

    try {
        async function createImage(url) {
            const { imageMessage } = await generateWAMessageContent({ image: { url } }, { upload: conn.waUploadToServer });
            return imageMessage;
        }

        let apiResponse = await fetch(`https://delirius-apiofc.vercel.app/search/bingimage?query=${encodeURIComponent(text)}`);
        let json = await apiResponse.json();

        if (!json.results || json.results.length === 0) return m.reply('❌ لم يتم العثور على صور لبحثك.');

        let push = [];

        for (let item of json.results.slice(0, 5)) {
            if (!item.direct) continue; // تجاهل العناصر التي لا تحتوي على رابط صورة صالح

            let image = await createImage(item.direct);
            push.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({ text: `◦ *🌺 العنوان:* ${item.title || 'بدون عنوان'}` }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: '' }),
                header: proto.Message.InteractiveMessage.Header.fromObject({ title: '', hasMediaAttachment: true, imageMessage: image }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        "name": "cta_url",
                        "buttonParamsJson": `{"display_text":"🌐 عرض المصدر","url":"${item.source}"}`
                    }]
                })
            });
        }

        if (push.length === 0) return m.reply('❌ لم يتم العثور على صور صالحة.');

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({ text: `🔎 *نتائج لـ:* ${text} 🌺` }),
                        footer: proto.Message.InteractiveMessage.Footer.create({ text: '🌺 الصور التي تم العثور عليها 🌺' }),
                        header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: [...push] })
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (error) {
        console.error(error);
        m.reply('❌ حدث خطأ أثناء البحث عن الصور. يرجى المحاولة لاحقًا.');
    }
};

handler.command = /^(تصفح)$/i;
export default handler;

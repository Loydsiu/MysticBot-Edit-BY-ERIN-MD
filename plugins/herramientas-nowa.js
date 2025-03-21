const { Client, Buttons } = require("whatsapp-web.js");

globalThis.bot.on("message", async (msg) => {
    if (msg.body.toLowerCase() === "تجربة") {
        try {
            let button = new Buttons(
                "✨ اختر أحد الأزرار:",
                [
                    { id: "1", body: "زر 1" },
                    { id: "2", body: "زر 2" }
                ],
                "📌 القائمة الرئيسية",
                "بوت واتساب"
            );

            await globalThis.bot.sendMessage(msg.from, button);
            console.log("✅ الأزرار تعمل!");
        } catch (error) {
            console.log("❌ خطأ في إرسال الأزرار:", error);
        }
    }
});

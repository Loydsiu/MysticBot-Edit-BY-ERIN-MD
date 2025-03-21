const { Buttons } = require("whatsapp-web.js");

globalThis.bot.on("message", async (msg) => {
    if (msg.body.toLowerCase() === "حمام") {
        let button = new Buttons(
            "🔹 اختر المهمة التي تريد تنفيذها:",
            [
                { body: "قسّم الأعضاء" },
                { body: "إضافة مشرف" },
                { body: "إزالة مشرف" }
            ],
            "⚙️ القائمة الرئيسية",
            "اختر خيارًا من الأزرار 👇"
        );

        globalThis.bot.sendMessage(msg.from, button);
    }
});

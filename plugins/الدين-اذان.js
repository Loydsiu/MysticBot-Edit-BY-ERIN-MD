import fetch from "node-fetch";

const Mori = [
    { code: "EG", ar: "*❐『مـصـر』*", capital: "القاهرة" },
    { code: "SA", ar: "*❐『السـعـوديـة』*", capital: "الرياض" },
    { code: "AE", ar: "*❐『الإمـارات』*", capital: "أبو ظبي" },
    { code: "KW", ar: "*❐『الـكـويـت』*", capital: "مدينة الكويت" },
    { code: "DZ", ar: "*❐『الجـزائـر』*", capital: "الجزائر" },
    { code: "TN", ar: "*❐『تـونـس』*", capital: "تونس" },
    { code: "MA", ar: "*❐『المـغـرب』*", capital: "الرباط" },
    { code: "TR", ar: "*❐『تـركـيـا』*", capital: "أنقرة" },
    { code: "ID", ar: "*❐『إندونـيـسـيـا』*", capital: "جاكرتا" },
    { code: "MY", ar: "*❐『مـالـيـزيـا』*", capital: "كوالالمبور" },
    { code: "PK", ar: "*❐『بـاكـسـتـان』*", capital: "إسلام أباد" },
    { code: "BD", ar: "*❐『بـنـغـلاديـش』*", capital: "دكا" },
    { code: "IQ", ar: "*❐『العـراق』*", capital: "بغداد" },
    { code: "SY", ar: "*❐『سـوريـا』*", capital: "دمشق" },
    { code: "JO", ar: "*❐『الأردن』*", capital: "عمان" },
    { code: "LB", ar: "*❐『لـبـنـان』*", capital: "بيروت" },
    { code: "SD", ar: "*❐『السـودان』*", capital: "الخرطوم" },
    { code: "LY", ar: "*❐『لـيـبـيـا』*", capital: "طرابلس" },
    { code: "YE", ar: "*❐『الـيـمـن』*", capital: "صنعاء" },
    { code: "OM", ar: "*❐『عـمـان』*", capital: "مسقط" },
    { code: "QA", ar: "*❐『قـطـر』*", capital: "الدوحة" },
    { code: "BH", ar: "*❐『الـبـحـريـن』*", capital: "المنامة" }
];

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text || text.trim() === "") {
        let countryList = Mori.map((country, index) => `${index + 1}. ${country.ar}`).join('\n');
        return m.reply(`˼📍˹ *اخـتـر الـدولـة مـن الـقـائـمـة الـتـالـيـة بـالـرد بـرقـمـهـا:*\n*╮┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅*\n${countryList} \n*╯┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅*\n*╮✰✰✰✰✰✰✰✰✰✰✰*
\n*مــثــال الاســتــخــدام:* \n> ${usedPrefix + command} 1\n*╯✰✰✰✰✰✰✰✰✰✰✰*\n> © 𝐋𝐎𝐘𝐃 𝐅𝐑𝐎𝐍𝐓𝐄𝐑𝐀`);
    }

    let countryIndex = parseInt(text.trim(), 10) - 1;

    if (isNaN(countryIndex) || countryIndex < 0 || countryIndex >= Mori.length) {
        return m.reply("⚠️ *خطأ!* الرجاء اختيار رقم صحيح من القائمة.");
    }

    let country = Mori[countryIndex];
    let capitalName = country.capital;

    try {
        let res = await fetchPrayerTimes(capitalName);
        if (res) {
            return m.reply(`*❐═━━━═╊⊰🏯⊱╉═━━━═❐*\n📍 مواقيت الصلاة في ${capitalName} ${country.ar}\n*❐═━━━═╊⊰🏯⊱╉═━━━═❐*\n` +
                `${Object.entries(res).map(([name, data]) => `- *${name}*: ${data}`
).join('\n')}`);
        } else {
            return m.reply("❌ لم يتم العثور على بيانات الصلاة لهذه الدولة.");
        }
    } catch (e) {
        return m.reply("❌ حدث خطأ أثناء جلب بيانات الصلاة.");
    }
};

handler.help = ['adhan'];
handler.tags = ['islam'];
handler.command = /^(اذان|أذان|الاذان|الأذان)$/i;
export default handler;

async function fetchPrayerTimes(city) {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=2`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !data.data || !data.data.timings) {
            return null;
        }

        const prayerTimes = {
            "📅 التاريخ": data.data.date.readable,
            "🕌 الفجر": convertTo12Hour(data.data.timings.Fajr),
            "☀️ الشروق": convertTo12Hour(data.data.timings.Sunrise),
            "☀️ الظهر": convertTo12Hour(data.data.timings.Dhuhr),
            "🌅 العصر": convertTo12Hour(data.data.timings.Asr),
            "🌇 المغرب": convertTo12Hour(data.data.timings.Maghrib),
            "🌌 العشاء": convertTo12Hour(data.data.timings.Isha)
        };

        return prayerTimes;
    } catch (error) {
        console.error("❌ خطأ أثناء جلب البيانات:", error);
        return null;
    }
}

function convertTo12Hour(time) {
    let [hours, minutes] = time.split(":").map(Number);
    let period = hours >= 12 ? "م" : "ص";
    hours = hours % 12 || 12; 
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}
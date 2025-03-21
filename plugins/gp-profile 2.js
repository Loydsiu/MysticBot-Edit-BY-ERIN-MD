import { cpus, totalmem, freemem } from 'os'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})

let handler = async (m, { conn }) => {
  try {
    // جلب قائمة الدردشات والمجموعات
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
    const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'))

    // معلومات المعالج والذاكرة
    const used = process.memoryUsage()
    const cpuInfo = cpus().reduce((acc, cpu) => {
      acc.total += Object.values(cpu.times).reduce((a, b) => a + b, 0)
      acc.speed += cpu.speed / cpus().length
      return acc
    }, { total: 0, speed: 0 })

    // اختبار سرعة الاستجابة
    let start = performance.now()
    let end = performance.now()
    let speed = (end - start).toFixed(2)

    // إنشاء النص
    let botInfo = `
≡ *📊 معلومات البوت*

📌 *الحالة:*
- 📂 مجموعات نشطة: *${groupsIn.length}*
- 🏠 دردشات خاصة: *${chats.length - groupsIn.length}*
- 💬 إجمالي الدردشات: *${chats.length}*

🚀 *أداء البوت:*
- ⚡ سرعة الاستجابة: *${speed}* مللي ثانية
- 🖥️ سرعة المعالج: *${cpuInfo.speed} MHz*

💾 *ذاكرة الجهاز:*
- 🔴 المستخدمة: *${format(totalmem() - freemem())}*
- 🟢 المتاحة: *${format(freemem())}*
- 🔵 الكلية: *${format(totalmem())}*

📊 *ذاكرة NodeJS:*
${'```' + Object.entries(used).map(([key, value]) => `${key.padEnd(15)}: ${format(value)}`).join('\n') + '```'}
`.trim()

    conn.sendMessage(m.chat, { text: botInfo }, { quoted: m })
  } catch (error) {
    console.error(error)
    m.reply('❌ حدث خطأ أثناء جلب المعلومات!')
  }
}

handler.help = ['infobot']
handler.tags = ['main']
handler.command = ['infobot', 'botinfo', 'معلومات_البوت']
handler.owner = true

export default handler

let handler = async (m) => {
    let randomAge = Math.floor(Math.random() * 80) + 1 // يعطي عمر عشوائي بين 1 و 80

    let funnyComments = [
        "😂 شكلك مولود قبل恐竜 (الديناصورات)!",
        "🤣 لا تنسى تحتفل بعيد ميلادك الجاي، بيصير عندك شيب!",
        "😅 هذا العمر ولا عمر البطارية؟",
        "🤔 لحظة.. انت متأكد انك مش من عصر الفراعنة؟",
        "🔥 لا تنسى تحجز تقاعدك من الآن!",
        "🤭 لو عمرك فعلاً كذا، لازم يكون عندك خبرة في كل شيء!",
        "😂 لا لا، مستحيل! كأنك مولود أمس!",
        "😜 العمر مجرد رقم، بس رقمك كبير شوي!"
    ]

    let randomComment = funnyComments[Math.floor(Math.random() * funnyComments.length)] // اختيار تعليق عشوائي
    let message = `🎂 عمرك هو *${randomAge}* سنة! ${randomComment}`

    m.reply(message)
}

handler.command = /^(عمري|كم عمري)$/i
handler.tags = ['fun']
export default handler

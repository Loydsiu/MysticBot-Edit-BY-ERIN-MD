let handler = async (m, { conn, text, participants, isAdmin, isOwner }) => {
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid)
    let bcbg = 'https://telegra.ph/file/da19d1c4c1e23b8b9c72e.jpg'
    conn.send3ButtonLoc(m.chat, bcbg, wm, `${text ? `${text}\n` : ''}┌─「 Tag All 」\n` + users.map(v => '│◦❒ @' + v.replace(/@.+/, '')).join`\n` + '\n└────','Menu', '.menu', 'Owner', '.owner', `\nKakek Gw Sugiono`, '.huuu', null,

    })
}

handler.help = ['لولي']
handler.tags = ['owner']
handler.command = ['لولي']
handler.owner = true
handler.group = true
export default handler

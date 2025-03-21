let handler = m => m
handler.all = async function (m) {
let chat = global.db.data.chats[m.chat]

if (!chat.isBanned && chat.audios && m.text.match(/(هاي|هاي)/gi)) {    
let vn = './media/هاي.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}

return !0 }
export default handler

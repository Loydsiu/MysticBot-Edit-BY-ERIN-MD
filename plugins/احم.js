let handler = m => m
handler.all = async function (m) {
let chat = global.db.data.chats[m.chat]


  
if (!chat.isBanned && chat.audios && m.text.match(/(ايزن|ايزن)/gi)) {    
let vn = './media/ايزن.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}


  if (!chat.isBanned && chat.audios && m.text.match(/(غوكو|goku)/gi)) {  
let vn = './LOYD.video/Goku.mp4'
this.sendPresenceUpdate('recording', m.chat)   
  this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}


  if (!chat.isBanned && chat.audios && m.text.match(/(غوجو|gojo)/gi)) {  
  let vn = './Gojo.mp4'
this.sendPresenceUpdate('recording', m.chat)   
  this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}


  if (!chat.isBanned && chat.audios && m.text.match(/(3MK|عمك)/gi)) {    
  let vn = './Ronaldo.mp4'
this.sendPresenceUpdate('recording', m.chat)   
  this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}


  if (!chat.isBanned && chat.audios && m.text.match(/(ايزن|عمك)/gi)) {  
  let vn = './Goku.mp4'
this.sendPresenceUpdate('recording', m.chat)   
  this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}




  
  
  if (!chat.isBanned && chat.audios && m.text.match(/(لويد|لويد)/gi)) {  
  let vn = './media/uauicb.mp4'
this.sendPresenceUpdate('recording', m.chat)   
  this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}


  
  if (!chat.isBanned && chat.audios && m.text.match(/loyd1/gi) {    
  let vn = './LOYD1.mp4'
this.sendPresenceUpdate('recording', m.chat)   
  this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}



  if (!chat.isBanned && chat.audios && m.text.match(/عمي|cc/gi) {    
  let vn = './LOYD2.mp4'
this.sendPresenceUpdate('recording', m.chat)   
  this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}



  
  if (!chat.isBanned && chat.audios && m.text.match(/bb|عمك/gi) {    
  let vn = './LOYD3.mp4'
this.sendPresenceUpdate('recording', m.chat)   
  this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}

  
  
  if (!chat.isBanned && chat.audios && m.text.match(/فخامة|loyd/gi) {    
  let vn = './LOYD4.mp4'
this.sendPresenceUpdate('recording', m.chat)   
  this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}


  if (!chat.isBanned && chat.audios && m.text.match(/lilo|حب/gi) {    
    let vn = './حب.png'
this.sendPresenceUpdate('recording', m.chat)   
    this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true})}


  
return !0 }
export default handler

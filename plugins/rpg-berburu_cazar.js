let handler = async (m, { conn }) => {
	const fkontak = {
		"key": {
			"participants": "0@s.whatsapp.net",
			"remoteJid": "status@broadcast",
			"fromMe": false,
			"id": "مرحبا"
		},
		"message": {
			"contactMessage": {
				"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:بوت;صيد;;\nFN:صيد\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:هاتف\nEND:VCARD`
			}
		},
		"participant": "0@s.whatsapp.net"
	};

	let user = global.db.data.users[m.sender];

	// الشخصيات المتاحة في اللعبة
	const characters = {
		"الوحش": { health: 100, attack: 20, special: "قوة خارقة", specialEffect: (target) => target.health -= 40 },
		"الرامي": { health: 80, attack: 25, special: "سهام سريعة", specialEffect: (target) => target.health -= 30 },
		"الفرسان": { health: 120, attack: 15, special: "درع حديدي", specialEffect: (target) => target.attack += 10 }
	};

	// إذا لم يختار اللاعب شخصية، يتم تعيين "الوحش" افتراضيًا
	if (!user.character) {
		user.character = "الوحش";
		global.db.data.users[m.sender] = user;  // تحديث الشخصية في قاعدة البيانات
	}

	// اختيار خصم عشوائي
	const enemies = Object.keys(characters);
	let enemyCharacter = enemies[Math.floor(Math.random() * enemies.length)];

	let player = characters[user.character];
	let enemy = characters[enemyCharacter];

	// حساب الضرر الذي يسببه اللاعب للخصم
	let playerDamage = Math.floor(Math.random() * player.attack) + 10;
	enemy.health -= playerDamage;

	// فرصة لاستخدام القدرة الخاصة
	let useSpecial = Math.random() < 0.3;  // 30% فرصة لاستخدام القدرة الخاصة
	if (useSpecial) {
		await conn.sendMessage(m.chat, `${user.character} استخدم قدرته الخاصة: *${player.special}*!`);
		player.specialEffect(enemy);
	}

	// إذا تم هزيمة الخصم
	if (enemy.health <= 0) {
		return conn.sendMessage(m.chat, `${user.character} فاز! هزم ${enemyCharacter} في المعركة.`);
	}

	// حساب الضرر الذي يسببه الخصم للاعب
	let enemyDamage = Math.floor(Math.random() * enemy.attack) + 10;
	player.health -= enemyDamage;

	// إذا تم هزيمة اللاعب
	if (player.health <= 0) {
		return conn.sendMessage(m.chat, `${user.character} خسر! ${enemyCharacter} هزمك في المعركة.`);
	}

	// حالة المعركة
	let battleStatus = `*حالة المعركة*\n\n${user.character}: 💪 الصحة ${player.health}\n${enemyCharacter}: ⚔️ الصحة ${enemy.health}`;
	conn.sendMessage(m.chat, battleStatus, { quoted: fkontak });

	// حفظ الوقت للمعركة القادمة
	global.db.data.users[m.sender].lastCombat = new Date().getTime();
};

handler.help = ['صراع الأبطال']
handler.tags = ['rpg']
handler.command = /^(صراع الأبطال|combat)$/i
export default handler;

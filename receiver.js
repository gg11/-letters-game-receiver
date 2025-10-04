const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

// --- تعريف قناة الاتصال الخاصة بنا ---
const CUSTOM_NAMESPACE = 'urn:x-cast:com.lettersgame.referee';
context.addCustomMessageListener(CUSTOM_NAMESPACE, (event) => {
  // event.data هو الأمر القادم من جوال الحكم
  handleCommand(event.data);
});

// --- العناصر في الصفحة ---
const grid = document.getElementById('grid');
const timerDisplay = document.getElementById('timer');
const winnerScreen = document.getElementById('winner-screen');
const winnerNameDisplay = document.getElementById('winner-name');
const gameContainer = document.getElementById('game-container');

// --- دالة معالجة الأوامر ---
function handleCommand(command) {
  console.log("Received command:", command);

  switch (command.type) {
    // أمر لإنشاء شبكة الحروف لأول مرة
    case 'SETUP_GRID':
      grid.innerHTML = ''; // نفرغ الشبكة القديمة
      command.letters.forEach((letter, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = `cell-${index}`;
        cell.textContent = letter;
        grid.appendChild(cell);
      });
      break;

    // أمر لتحديث حالة (لون) حرف معين
    case 'UPDATE_LETTER_STATE':
      // نزيل الحالة القديمة من كل الخلايا أولاً
      document.querySelectorAll('.cell').forEach(c => {
        c.classList.remove('current');
      });
      
      // نطبق الحالة الجديدة
      const cellToUpdate = document.getElementById(`cell-${command.index}`);
      if (cellToUpdate) {
        // نزيل كل حالات الألوان القديمة قبل إضافة اللون الجديد
        cellToUpdate.classList.remove('player1', 'player2', 'current');
        if (command.state !== 'default') { // 'default' يعني أبيض
          cellToUpdate.classList.add(command.state);
        }
      }
      break;

    // أمر لتحديث المؤقت
    case 'UPDATE_TIMER':
      timerDisplay.textContent = command.time;
      break;

    // أمر لإظهار شاشة الفائز
    case 'SHOW_WINNER':
      winnerNameDisplay.textContent = command.name;
      winnerNameDisplay.style.color = command.color;
      gameContainer.style.display = 'none'; // نخفي اللعبة
      winnerScreen.style.display = 'flex'; // نظهر شاشة الفوز
      break;

    // أمر لإعادة بدء اللعبة
    case 'RESET_GAME':
      winnerScreen.style.display = 'none'; // نخفي شاشة الفوز
      gameContainer.style.display = 'flex'; // نظهر اللعبة
      // نعيد كل الخلايا للونها الافتراضي
      document.querySelectorAll('.cell').forEach(c => {
        c.className = 'cell';
      });
      break;
  }
}

// --- بدء تشغيل المُستقبِل ---
context.start({
  statusText: "لعبة الحروف جاهزة للبدء",
  maxInactivity: 3600 // إبقاء الجلسة حية لمدة ساعة بدون أوامر
});
console.log('Receiver-ul este gata și așteaptă comenzi.');

// 1. الحصول على سياق المُستقبِل
const context = cast.framework.CastReceiverContext.getInstance();

// 2. تعريف "اللغة السرية" أو اسم القناة الخاصة بنا
const CUSTOM_NAMESPACE = 'urn:x-cast:com.lettersgame.control';

// 3. إخبار المُستقبِل أن يستمع للرسائل على هذه القناة
context.addCustomMessageListener(CUSTOM_NAMESPACE, (customEvent) => {
  // هذه الدالة ستعمل كلما وصلت رسالة من الجوال
  console.log('Message received from sender:', customEvent.data);
  
  // نقوم بمعالجة الأمر الذي وصل
  handleCommand(customEvent.data);
});

// دالة لمعالجة الأوامر القادمة
function handleCommand(command) {
  const gameStateDiv = document.getElementById('game-state');
  
  // نفحص نوع الأمر ونقوم بتنفيذه
  if (command.action === 'SHOW_QUESTION') {
    // إذا كان الأمر هو عرض سؤال، نعرض السؤال والخيارات
    let optionsHtml = command.payload.options.map(option => `<p>${option}</p>`).join('');
    gameStateDiv.innerHTML = `<h2>${command.payload.question}</h2><div>${optionsHtml}</div>`;

  } else if (command.action === 'SHOW_MESSAGE') {
    // إذا كان الأمر هو عرض رسالة، نعرضها
    gameStateDiv.innerHTML = `<h1>${command.message}</h1>`;

  } else {
    // إذا وصل أمر غير معروف، نعرض رسالة خطأ
    gameStateDiv.innerHTML = `<p>أمر غير معروف: ${JSON.stringify(command)}</p>`;
  }
}

// 4. بدء تشغيل المُستقبِل وتمديد وقت الانتظار إلى ساعة كاملة (3600 ثانية)
context.start({
  statusText: "لعبة الحروف جاهزة",
  maxInactivity: 3600 
});

console.log('Receiver is ready and listening for commands...');

(function () {
  'use strict';

  const STORAGE_KEY = 'english-town-mission-v1';
  const profiles = {
    fox: { id: 'fox', name: '阿洛', title: '晨光探员', image: 'assets/fox.svg', badge: 'A', color: '#e98854' },
    rabbit: { id: 'rabbit', name: '米米', title: '线索探员', image: 'assets/rabbit.svg', badge: 'M', color: '#d89b4f' }
  };
  const units = {
    morning: {
      id: 'morning', number: '01', name: 'My morning', zh: '我的早晨',
      scene: 'assets/morning.svg', label: 'UNIT 01 · 早晨线索',
      intro: '清晨的能量钟停住了。帮探员按顺序找回今天的五个动作。',
      words: ['get up', 'brush my teeth', 'wash my face', 'get dressed', 'have breakfast'],
      grammar: { title: '句子密码', pattern: ['I', '+', '动作'], example: 'I get up.', note: '说自己做什么：先说 I，再说动作。' },
      phonics: { letter: 'm', sample: 'morning, my', title: '听一听开头音', text: 'morning、my 都从 /m/ 开始。听到 /m/，把它留在探员背包里。' },
      tasks: [
        { type: 'listen', label: '第一条线索 · 听一听', title: '哪一张图是 “get up”？', prompt: '先听声音，再选择正确的动作。', audio: 'get up', options: [
          { icon: '🛏️', text: 'get up', correct: true }, { icon: '🪥', text: 'brush my teeth' }, { icon: '🍞', text: 'have breakfast' }
        ] },
        { type: 'build', label: '第二条线索 · 拼一拼', title: '把线索拼成一句话', prompt: '句首的大写字母会提醒你从哪里开始。', audio: 'I get up in the morning.', words: ['I', 'get up', 'in the morning.'], answer: ['I', 'get up', 'in the morning.'] },
        { type: 'speak', label: '第三条线索 · 说一说', title: '成为晨光探员', prompt: '先听一遍，再试着说给自己的探员徽章听。', audio: 'I brush my teeth.', phrase: 'I brush my teeth.' },
        { type: 'transfer', label: '最终线索 · 换一换', title: '早餐时间到了', prompt: '哪句话和这张图片最匹配？', audio: 'I have breakfast.', options: [
          { icon: '🍞', text: 'I have breakfast.', correct: true }, { icon: '👕', text: 'I get dressed.' }, { icon: '💧', text: 'I wash my face.' }
        ] }
      ]
    },
    room: {
      id: 'room', number: '02', name: 'My room', zh: '我的房间',
      scene: 'assets/room.svg', label: 'UNIT 02 · 房间线索',
      intro: '基地里的小物品换了位置。跟着位置词，帮探员整理房间。',
      words: ['on the desk', 'in the box', 'under the bed'],
      grammar: { title: '句子密码', pattern: ['物品', '+ is +', '位置'], example: 'The book is on the desk.', note: '说一个物品在哪里：物品后面用 is，再说位置。' },
      phonics: { letter: 'b', sample: 'book, box, bed', title: '听一听开头音', text: 'book、box、bed 都从 /b/ 开始。找到三个 /b/ 线索。' },
      tasks: [
        { type: 'listen', label: '第一条线索 · 听一听', title: 'Where is the book?', prompt: '听问题，找到书的位置。', audio: 'The book is on the desk.', options: [
          { icon: '🪑', visual: 'desk', text: 'on the desk', correct: true }, { icon: '📦', visual: 'box', text: 'in the box' }, { icon: '🛏️', visual: 'bed', text: 'under the bed' }
        ] },
        { type: 'build', label: '第二条线索 · 拼一拼', title: '把位置说清楚', prompt: '人物 + 物品 + 位置，线索就完整了。', audio: 'The book is on the desk.', words: ['The book', 'is', 'on the desk.'], answer: ['The book', 'is', 'on the desk.'] },
        { type: 'speak', label: '第三条线索 · 说一说', title: '和搭档互相问答', prompt: '先听问题，再说出完整回答。', audio: 'Where is the ball? It is under the bed.', phrase: 'It is under the bed.' },
        { type: 'transfer', label: '最终线索 · 换一换', title: '盒子里还有什么？', prompt: '看图选择正确的句子。', audio: 'The pencil is in the box.', options: [
          { icon: '✏️', visual: 'box', text: 'The pencil is in the box.', correct: true }, { icon: '✏️', visual: 'desk', text: 'The pencil is on the desk.' }, { icon: '✏️', visual: 'bed', text: 'The pencil is under the bed.' }
        ] }
      ]
    }
  };

  const defaultState = {
    activeProfile: 'fox',
    sound: true,
    progress: {
      fox: { completed: [], attempts: 0, wins: 0, last: '', reviewDue: {}, errors: {} },
      rabbit: { completed: [], attempts: 0, wins: 0, last: '', reviewDue: {}, errors: {} }
    }
  };
  let state = loadState();
  let currentUnit = null;
  let stageIndex = 0;
  let stageDone = false;
  let mediaRecorder = null;
  let recordUrl = '';
  let recordingRequested = false;
  let recordingStream = null;
  let recordingEpoch = 0;

  const view = document.getElementById('view');
  const insight = document.getElementById('insight');
  const crumb = document.getElementById('crumb');

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored) return structuredClone(defaultState);
      const merged = Object.assign({}, defaultState, stored);
      merged.progress = {};
      Object.keys(profiles).forEach(function (id) {
        merged.progress[id] = Object.assign({}, defaultState.progress[id], (stored.progress && stored.progress[id]) || {});
        merged.progress[id].reviewDue = Object.assign({}, defaultState.progress[id].reviewDue, merged.progress[id].reviewDue || {});
        merged.progress[id].errors = Object.assign({}, defaultState.progress[id].errors, merged.progress[id].errors || {});
      });
      return merged;
    } catch (error) { return structuredClone(defaultState); }
  }

  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function activeProfile() { return profiles[state.activeProfile]; }
  function activeProgress() { return state.progress[state.activeProfile]; }
  function dueUnits() {
    const now = Date.now();
    const due = activeProgress().reviewDue || {};
    return Object.keys(due).filter(function (id) { return units[id] && due[id] <= now; });
  }
  function updateReviewCount() { document.getElementById('review-count').textContent = dueUnits().length || ''; }
  function todayText() { return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' }).format(new Date()); }
  function esc(value) { return String(value).replace(/[&<>"']/g, function (char) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]; }); }

  function refreshIcons() {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  }

  function speak(text) {
    if (!state.sound || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[\u3400-\u9fff]/.test(text) ? 'zh-CN' : 'en-US';
    utterance.rate = 0.76;
    utterance.pitch = 1.02;
    window.speechSynthesis.speak(utterance);
  }

  function setActiveNav(name) {
    document.querySelectorAll('.main-nav button').forEach(function (button) { button.classList.toggle('active', button.dataset.action === name); });
  }

  function renderProfiles() {
    updateReviewCount();
    document.getElementById('profiles').innerHTML = Object.values(profiles).map(function (profile) {
      const selected = profile.id === state.activeProfile;
      return '<button class="profile ' + (selected ? 'active' : '') + '" type="button" data-profile="' + profile.id + '" aria-pressed="' + selected + '"><img src="' + profile.image + '" alt="' + profile.name + '"><span><strong>' + profile.name + '</strong><small>' + profile.title + '</small></span>' + (selected ? '<span class="profile-check">●</span>' : '') + '</button>';
    }).join('');
    document.querySelectorAll('[data-profile]').forEach(function (button) { button.addEventListener('click', function () { stopActiveRecording(); state.activeProfile = button.dataset.profile; saveState(); renderHub(); }); });
  }

  function recommendedUnit(progress) {
    const due = dueUnits();
    if (due.length) return due[0];
    if (!progress.completed.includes('morning')) return 'morning';
    if (!progress.completed.includes('room')) return 'room';
    return 'morning';
  }

  function renderInsight() {
    const profile = activeProfile();
    const progress = activeProgress();
    const percent = Math.round((progress.completed.length / 2) * 100);
    const recommendation = recommendedUnit(progress);
    const recommendationTitle = dueUnits().length ? '复习 ' + units[recommendation].name : progress.completed.length === 2 ? '重玩 My morning' : '开始 ' + units[recommendation].name;
    insight.innerHTML = '<div class="right-title">当前探员</div>' +
      '<div class="insight-profile"><img src="' + profile.image + '" alt=""><div><strong>' + profile.name + '</strong><span>' + profile.title + ' · 今日在线</span></div></div>' +
      '<div class="ring-wrap"><div class="ring" style="--progress:' + percent + '%"><strong>' + percent + '%</strong></div><div class="ring-copy"><strong>本阶段进度</strong><span>完成两个任务即可<br>解锁下一张地图</span></div></div>' +
      '<div class="rule"></div><div class="side-panel-title">今日线索 <span>10—20分钟</span></div>' +
      '<div class="daily-task"><small>推荐任务</small><strong>' + recommendationTitle + '</strong><p>听一听、看一看，再把线索说给探员徽章听。</p><button type="button" data-action="start" data-unit="' + recommendation + '">进入任务 <span>→</span></button></div>' +
      '<div class="coop-note"><small>双人搭档提示</small><p>两个人可以轮换“听线索”和“说台词”。只有一个人时，系统会读出另一位探员的台词。</p></div>' +
      '<p class="source-note">本页词组依据新版二年级上册公开目录；完整短句为围绕词组编写的原创练习。</p>';
    insight.querySelectorAll('[data-action="start"]').forEach(function (button) { button.addEventListener('click', function () { startUnit(button.dataset.unit); }); });
  }

  function renderHub() {
    stopActiveRecording(); currentUnit = null; setActiveNav('hub'); crumb.textContent = '任务地图';
    renderProfiles(); renderInsight();
    const profile = activeProfile();
    const progress = activeProgress();
    const completeCount = progress.completed.length;
    const recommendation = recommendedUnit(progress);
    view.innerHTML = '<div class="view-heading"><div><div class="eyebrow">小城探险 · 第一章</div><h1>' + profile.name + '，今天找哪条线索？</h1><p class="subline">选择一项任务开始。每一关都可以听、看、拼和说。</p></div><div class="overview-pill">已完成 ' + completeCount + ' / 2 个任务</div></div>' +
      '<section class="scene"><img class="scene-bg" src="assets/morning.svg" alt="晨光中的探员基地"><div class="scene-copy"><small>THE MORNING SIGNAL</small><h2>晨光信号<br>重新亮起</h2><p>两个探员需要找回散落在城市里的英语线索。</p><button type="button" class="primary-button" data-action="start" data-unit="' + recommendation + '"><i data-lucide="play">▶</i>' + (dueUnits().length ? '复习今日线索' : completeCount === 2 ? '再玩一次' : completeCount ? '继续房间任务' : '开始第一条线索') + '</button></div><img class="scene-avatar" src="' + profiles.fox.image + '" alt=""><img class="scene-avatar partner" src="' + profiles.rabbit.image + '" alt=""></section>' +
      '<div class="section-title"><h2>当前任务</h2><span>二年级上册 · 第一阶段</span></div>' +
      '<div class="mission-grid">' + missionCard(units.morning, progress.completed.indexOf('morning') >= 0) + missionCard(units.room, progress.completed.indexOf('room') >= 0) + '</div>';
    bindHubEvents(); refreshIcons();
  }

  function missionCard(unit, done) {
    return '<button type="button" class="mission" data-action="start" data-unit="' + unit.id + '"><div class="mission-art"><img src="' + unit.scene + '" alt=""><span class="mission-num">' + unit.number + '</span></div><div class="mission-body"><span class="unit-label">' + unit.label + '</span><h3>' + unit.name + '</h3><p>' + unit.zh + ' · ' + (done ? (dueUnits().includes(unit.id) ? '今日待复习' : '已完成，可重玩') : unit.words.slice(0, 3).join(' · ')) + '</p><div class="mission-bottom"><span>' + (done ? '重玩本关' : '开始探险') + '</span><i data-lucide="' + (done ? 'rotate-ccw' : 'arrow-up-right') + '">↗</i></div></div></button>';
  }

  function bindHubEvents() {
    view.querySelectorAll('[data-action="start"]').forEach(function (button) { button.addEventListener('click', function () { startUnit(button.dataset.unit); }); });
  }

  function startUnit(unitId) {
    stopActiveRecording(); currentUnit = units[unitId]; stageIndex = 0; stageDone = false; setActiveNav('hub'); renderGame();
  }

  function renderGame() {
    const unit = currentUnit; const task = unit.tasks[stageIndex]; const progress = activeProgress();
    crumb.textContent = unit.name; renderProfiles(); renderInsight();
    view.innerHTML = '<div class="game-header"><div><button type="button" class="back-button" data-action="back"><i data-lucide="arrow-left">←</i>返回任务地图</button><div class="eyebrow">' + unit.label + '</div><h1>' + unit.name + ' · ' + unit.zh + '</h1></div><span class="mini-tag">线索 ' + (stageIndex + 1) + ' / ' + unit.tasks.length + '</span></div>' +
      '<div class="progress-header"><span>探险进度</span><span>' + Math.round((stageIndex / unit.tasks.length) * 100) + '%</span></div><div class="progress-track"><i style="width:' + Math.round((stageIndex / unit.tasks.length) * 100) + '%"></i></div>' +
      '<div class="game-story"><img src="' + activeProfile().image + '" alt=""><p>' + unit.intro + '</p><button type="button" class="story-audio" data-action="speak" data-speak="' + esc(unit.intro) + '" aria-label="播放中文任务说明" title="播放任务说明"><i data-lucide="volume-2">🔊</i></button></div>' +
      renderTask(task) + renderGrammar(unit.grammar) + renderPhonics(unit.phonics);
    bindGameEvents(task); refreshIcons();
  }

  function renderTask(task) {
    if (task.type === 'listen' || task.type === 'transfer') return '<section class="task-box"><div class="task-label">' + task.label + '</div><h2 class="task-heading">' + task.title + '</h2><div class="listen-row"><button type="button" data-action="speak" data-speak="' + esc(task.audio) + '"><i data-lucide="volume-2">🔊</i>听英语</button><p>' + task.prompt + '</p></div><div class="answers">' + task.options.map(function (option, index) { return '<button type="button" class="answer" data-answer="' + (option.correct ? 'correct' : 'wrong') + '" data-answer-index="' + index + '"><span class="answer-visual" aria-hidden="true">' + (option.visual ? roomVisual(option.visual, task.type === 'listen' ? '📖' : '✏️') : option.icon) + '</span><span>' + option.text + '</span></button>'; }).join('') + '</div><div class="feedback" id="feedback" hidden></div><p class="task-note">可以反复听，不会扣分。</p></section>';
    if (task.type === 'build') return '<section class="task-box"><div class="task-label">' + task.label + '</div><h2 class="task-heading">' + task.title + '</h2><div class="listen-row"><button type="button" data-action="speak" data-speak="' + esc(task.audio) + '"><i data-lucide="volume-2">🔊</i>听示范</button><p>' + task.prompt + '</p></div><div class="word-area" id="word-area"><span class="word-placeholder">把单词卡放到这里</span></div><div class="word-bank" id="word-bank">' + shuffle(task.words.slice()).map(function (word, index) { return '<button type="button" class="word-chip" data-word="' + esc(word) + '" data-word-index="' + index + '">' + word + '</button>'; }).join('') + '</div><div class="word-actions"><button type="button" class="outline-button" data-action="clear-words"><i data-lucide="rotate-ccw">↺</i>重新开始</button><button type="button" class="secondary-button" data-action="check-words" disabled>检查句子 <i data-lucide="arrow-right">→</i></button></div><div class="feedback" id="feedback" hidden></div></section>';
    return '<section class="task-box"><div class="task-label">' + task.label + '</div><h2 class="task-heading">' + task.title + '</h2><div class="speech-phrase">' + task.phrase + '</div><div class="listen-row"><button type="button" data-action="speak" data-speak="' + esc(task.audio) + '"><i data-lucide="volume-2">🔊</i>听角色</button><p>' + task.prompt + '</p></div><div class="speech-controls"><button type="button" class="secondary-button" data-action="record"><i data-lucide="mic">◉</i>开始录音</button><button type="button" class="outline-button" data-action="speak" data-speak="' + esc(task.phrase) + '"><i data-lucide="play">▶</i>我先示范</button><button type="button" class="primary-button" data-action="complete-speech">我说好了 <i data-lucide="arrow-right">→</i></button></div><p class="mic-message" id="mic-message">录音只在本页临时回放，不上传或保存；也可以不录音继续。</p><div class="feedback" id="feedback" hidden></div></section>';
  }

  function roomVisual(position, item) {
    return '<span class="room-visual ' + position + '"><span class="room-item">' + item + '</span><span class="room-furniture"></span></span>';
  }

  function renderGrammar(grammar) {
    return '<div class="grammar-card"><div><strong>' + grammar.title + '</strong><p>' + grammar.note + '</p></div><div class="grammar-pattern">' + grammar.pattern.map(function (part) { return '<span>' + part + '</span>'; }).join('') + '</div><button type="button" data-action="speak" data-speak="' + esc(grammar.example) + '">听例句</button></div>';
  }

  function renderPhonics(phonics) { return '<div class="phonics"><div class="phonics-mark">/' + phonics.letter + '/</div><div><strong>' + phonics.title + '</strong><p>' + phonics.text + '</p></div><button type="button" data-action="speak" data-speak="' + esc(phonics.sample) + '">听词</button></div>'; }

  function bindGameEvents(task) {
    const back = view.querySelector('[data-action="back"]'); if (back) back.addEventListener('click', renderHub);
    view.querySelectorAll('[data-action="speak"]').forEach(function (button) { button.addEventListener('click', function () { speak(button.dataset.speak); }); });
    if (task.type === 'listen' || task.type === 'transfer') bindAnswerEvents();
    if (task.type === 'build') bindBuildEvents(task);
    if (task.type === 'speak') bindSpeechEvents(task);
  }

  function bindAnswerEvents() {
    view.querySelectorAll('.answer').forEach(function (button) { button.addEventListener('click', function () {
      const feedback = document.getElementById('feedback'); const correct = button.dataset.answer === 'correct';
      activeProgress().attempts += 1;
      view.querySelectorAll('.answer').forEach(function (option) { option.disabled = true; });
      button.classList.add(correct ? 'correct' : 'wrong');
      if (!correct) { activeProgress().errors[currentUnit.id] = (activeProgress().errors[currentUnit.id] || 0) + 1; saveState(); feedback.hidden = false; feedback.className = 'feedback error'; feedback.innerHTML = '<strong>再听一次，线索还在这里。</strong><button type="button" data-action="retry">重新选择</button>'; feedback.querySelector('[data-action="retry"]').addEventListener('click', function () { renderGame(); }); return; }
      stageDone = true; activeProgress().wins += 1; feedback.hidden = false; feedback.className = 'feedback success'; feedback.innerHTML = '<strong>找到了！这条线索已经放进背包。</strong><button type="button" data-action="next">下一条线索 →</button>'; feedback.querySelector('[data-action="next"]').addEventListener('click', nextStage); saveState();
    }); });
  }

  function bindBuildEvents(task) {
    const area = document.getElementById('word-area'); const bank = document.getElementById('word-bank'); const check = view.querySelector('[data-action="check-words"]'); let chosen = [];
    bank.querySelectorAll('.word-chip').forEach(function (button) { button.addEventListener('click', function () { if (button.classList.contains('placed')) return; chosen.push(button.dataset.word); button.classList.add('placed'); area.querySelector('.word-placeholder')?.remove(); const chip = document.createElement('span'); chip.className = 'word-chip placed'; chip.textContent = button.dataset.word; area.appendChild(chip); check.disabled = false; }); });
    view.querySelector('[data-action="clear-words"]').addEventListener('click', function () { renderGame(); });
    check.addEventListener('click', function () { const feedback = document.getElementById('feedback'); const correct = chosen.length === task.answer.length && chosen.join('|') === task.answer.join('|'); activeProgress().attempts += 1; if (!correct) { activeProgress().errors[currentUnit.id] = (activeProgress().errors[currentUnit.id] || 0) + 1; saveState(); feedback.hidden = false; feedback.className = 'feedback error'; feedback.innerHTML = '<strong>顺序还需要调整。想想谁先出现，再听一遍示范。</strong><button type="button" data-action="reset-build">重新拼</button>'; feedback.querySelector('[data-action="reset-build"]').addEventListener('click', function () { renderGame(); }); return; } stageDone = true; activeProgress().wins += 1; feedback.hidden = false; feedback.className = 'feedback success'; feedback.innerHTML = '<strong>句子完整，线索清楚了！</strong><button type="button" data-action="next">下一条线索 →</button>'; feedback.querySelector('[data-action="next"]').addEventListener('click', nextStage); check.disabled = true; saveState(); });
  }

  function bindSpeechEvents(task) {
    const recordButton = view.querySelector('[data-action="record"]');
    recordButton.addEventListener('click', function () {
      if (recordingRequested || (mediaRecorder && mediaRecorder.state === 'recording')) {
        stopRecording();
      } else {
        recordingRequested = true;
        recordButton.innerHTML = '<i data-lucide="square">■</i>结束录音';
        refreshIcons();
        startRecording();
      }
    });
    view.querySelector('[data-action="complete-speech"]').addEventListener('click', function () {
      const feedback = document.getElementById('feedback');
      stopActiveRecording(); stageDone = true;
      view.querySelector('[data-action="complete-speech"]').disabled = true;
      feedback.hidden = false; feedback.className = 'feedback success';
      feedback.innerHTML = '<strong>台词已完成；这里不自动判断发音。</strong><button type="button" data-action="next">下一条线索 →</button>';
      feedback.querySelector('[data-action="next"]').addEventListener('click', nextStage);
    });
  }

  async function startRecording() {
    const message = document.getElementById('mic-message');
    const epoch = ++recordingEpoch;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { recordingRequested = false; message.textContent = '当前浏览器不支持录音，可以点击“我先示范”继续。'; resetRecordButton(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!recordingRequested || epoch !== recordingEpoch) { stream.getTracks().forEach(function (track) { track.stop(); }); return; }
      recordingStream = stream;
      mediaRecorder = new MediaRecorder(stream); const chunks = [];
      mediaRecorder.ondataavailable = function (event) { if (event.data.size) chunks.push(event.data); };
      mediaRecorder.onstop = function () { stream.getTracks().forEach(function (track) { track.stop(); }); if (recordingStream === stream) recordingStream = null; if (epoch !== recordingEpoch || !chunks.length) return; const blob = new Blob(chunks, { type: chunks[0].type || 'audio/webm' }); if (recordUrl) URL.revokeObjectURL(recordUrl); recordUrl = URL.createObjectURL(blob); const messageNow = document.getElementById('mic-message'); if (!messageNow) return; messageNow.innerHTML = '录音完成，<button type="button" class="inline-play" data-action="play-record">回听自己的声音</button>'; messageNow.querySelector('[data-action="play-record"]').addEventListener('click', function () { new Audio(recordUrl).play(); }); };
      mediaRecorder.start();
      message.textContent = '正在录音，再点一次结束。';
    } catch (error) { if (epoch !== recordingEpoch) return; recordingRequested = false; message.textContent = '没有开启麦克风也没关系，可以点击“我先示范”继续。'; resetRecordButton(); }
  }
  function resetRecordButton() { const button = view.querySelector('[data-action="record"]'); if (button) { button.innerHTML = '<i data-lucide="mic">◉</i>开始录音'; refreshIcons(); } }
  function stopRecording() { recordingRequested = false; if (!mediaRecorder) recordingEpoch += 1; if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop(); mediaRecorder = null; resetRecordButton(); }
  function stopActiveRecording() { recordingRequested = false; recordingEpoch += 1; if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop(); mediaRecorder = null; if (recordingStream) recordingStream.getTracks().forEach(function (track) { track.stop(); }); recordingStream = null; if (recordUrl) URL.revokeObjectURL(recordUrl); recordUrl = ''; }

  function nextStage() { stopActiveRecording(); if (stageIndex >= currentUnit.tasks.length - 1) { finishUnit(); return; } stageIndex += 1; stageDone = false; renderGame(); }

  function finishUnit() { const progress = activeProgress(); if (progress.completed.indexOf(currentUnit.id) < 0) progress.completed.push(currentUnit.id); progress.last = currentUnit.name; progress.reviewDue[currentUnit.id] = Date.now() + 24 * 60 * 60 * 1000; saveState(); renderComplete(); }

  function renderComplete() {
    const unit = currentUnit; crumb.textContent = '任务完成'; renderProfiles(); renderInsight(); view.innerHTML = '<div class="game-header"><div><button type="button" class="back-button" data-action="back"><i data-lucide="arrow-left">←</i>返回任务地图</button><div class="eyebrow">MISSION COMPLETE</div><h1>' + unit.name + ' · 线索归档</h1></div></div><div class="complete"><div class="complete-badge">✦</div><h2>这条线索归队了</h2><p>' + activeProfile().name + ' 完成了听音、拼句和角色表达。下一次打开，可以直接复习这组词语。</p><div class="complete-actions"><button type="button" class="primary-button" data-action="next-unit"><i data-lucide="arrow-right">→</i>' + (unit.id === 'morning' ? '进入 My room' : '回到任务地图') + '</button><button type="button" class="outline-button" data-action="replay"><i data-lucide="rotate-ccw">↺</i>再玩一次</button></div></div><div class="phonics"><div class="phonics-mark">✓</div><div><strong>明日复习已安排</strong><p>明天会出现一条轻量复习线索。先休息，探员。</p></div></div>';
    const back = view.querySelector('[data-action="back"]'); back.addEventListener('click', renderHub);
    view.querySelector('[data-action="replay"]').addEventListener('click', function () { startUnit(unit.id); });
    view.querySelector('[data-action="next-unit"]').addEventListener('click', function () { if (unit.id === 'morning') startUnit('room'); else renderHub(); });
    refreshIcons();
  }

  function renderReview() { stopActiveRecording(); currentUnit = null; setActiveNav('review'); crumb.textContent = '今日复习'; renderProfiles(); renderInsight(); const ids = dueUnits(); const cards = ids.map(function (id) { const unit = units[id]; return '<button type="button" class="mission" data-action="review-unit" data-unit="' + id + '"><div class="mission-art"><img src="' + unit.scene + '" alt=""><span class="mission-num">复习</span></div><div class="mission-body"><span class="unit-label">' + unit.label + '</span><h3>' + unit.name + '</h3><p>重玩本关，巩固听音、拼句和表达。</p><div class="mission-bottom"><span>重玩本关</span><i data-lucide="arrow-up-right">↗</i></div></div></button>'; }).join(''); view.innerHTML = '<div class="view-heading"><div><div class="eyebrow">REVIEW DESK · 今日复习</div><h1>把线索再带回场景</h1><p class="subline">完成后可以重玩整关，复习过的关卡将在次日再次提醒。</p></div></div>' + (cards ? '<div class="mission-grid">' + cards + '</div>' : '<div class="review-empty"><div class="big-icon">☀</div><h2>今天还没有待复习线索</h2><p>完成一项任务，明天这里会出现待复习的关卡。</p><button type="button" class="primary-button" data-action="start" data-unit="morning">开始第一关 <i data-lucide="arrow-right">→</i></button></div>'); view.querySelectorAll('[data-action="review-unit"], [data-action="start"]').forEach(function (button) { button.addEventListener('click', function () { startUnit(button.dataset.unit); }); }); refreshIcons(); }

  function renderParent() { stopActiveRecording(); currentUnit = null; setActiveNav('parent'); crumb.textContent = '家长看板'; renderProfiles(); renderInsight(); const rows = Object.values(profiles).map(function (profile) { const p = state.progress[profile.id]; const percent = Math.round((p.completed.length / 2) * 100); const accuracy = p.attempts ? Math.min(100, Math.round((p.wins / p.attempts) * 100)) : 0; return '<div class="parent-profile"><img src="' + profile.image + '" alt=""><div><h2>' + profile.name + ' <span class="unit-label">' + profile.title + '</span></h2><label><span>阶段进度</span><span class="progress-track" style="width:110px"><i style="width:' + percent + '%"></i></span><strong>' + percent + '%</strong></label><p class="subline">已完成 ' + p.completed.length + ' 个任务 · 最近：' + (p.last || '还未开始') + '</p><p class="stat-line">答题 ' + p.attempts + ' 次 · 答对 ' + p.wins + ' 次 · 正确率 ' + (p.attempts ? accuracy + '%' : '暂无记录') + '</p><p class="stat-line">需要再练：' + (Object.keys(p.errors || {}).filter(function (id) { return p.errors[id]; }).map(function (id) { return units[id].name + ' ' + p.errors[id] + ' 次'; }).join(' · ') || '暂无') + '</p></div></div>'; }).join(''); view.innerHTML = '<div class="view-heading"><div><div class="eyebrow">PARENT VIEW · 低干预陪伴</div><h1>两个探员，各自的成长轨迹</h1><p class="subline">这里只显示学习趋势，不做兄妹排名。</p></div></div><div class="parent-grid"><div class="parent-panel"><h3>本阶段目标</h3><p>二年级上册前两个单元<br><strong>My morning</strong> · <strong>My room</strong></p></div><div class="parent-panel"><h3>建议陪伴</h3><p>每周挑一次任务结尾，让孩子把角色台词说给您听。每天无需陪同完成。</p></div></div><div class="parent-panel" style="margin-top:13px"><h3>探员记录</h3>' + rows + '</div><div class="privacy-note">发音不自动评分；录音仅在本页临时回放，不上传或保存，离开页面即删除。孩子可不录音直接继续。</div>'; refreshIcons(); }

  function shuffle(array) { for (let i = array.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); const temp = array[i]; array[i] = array[j]; array[j] = temp; } return array; }

  document.querySelectorAll('[data-action="hub"], [data-action="review"], [data-action="parent"]').forEach(function (button) { button.addEventListener('click', function () { if (button.dataset.action === 'hub') renderHub(); if (button.dataset.action === 'review') renderReview(); if (button.dataset.action === 'parent') renderParent(); }); });
  document.querySelector('[data-action="sound"]').addEventListener('click', function () { state.sound = !state.sound; saveState(); document.querySelector('.sound-button').classList.toggle('off', !state.sound); if (!state.sound && 'speechSynthesis' in window) window.speechSynthesis.cancel(); });
  document.querySelector('.sound-button').classList.toggle('off', !state.sound);
  window.addEventListener('pagehide', stopActiveRecording);
  document.getElementById('today').textContent = todayText();
  renderHub();
}());

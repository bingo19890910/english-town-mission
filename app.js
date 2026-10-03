(function () {
  'use strict';

  const STORAGE_KEY = 'english-town-mission-v1';
  const profiles = {
    fox: { id: 'fox', name: '阿洛', title: '晨光探员', image: 'assets/fox.svg', badge: 'A', color: '#e98854' },
    rabbit: { id: 'rabbit', name: '米米', title: '线索探员', image: 'assets/rabbit.svg', badge: 'M', color: '#d89b4f' }
  };
  const units = Object.assign({
    morning: {
      id: 'morning', number: '21', name: 'My morning', zh: '我的早晨',
      scene: 'assets/morning.svg', label: 'UNIT 21 · 早晨线索',
      intro: '清晨的能量钟停住了。帮探员按顺序找回今天的五个动作。',
      words: ['get up', 'brush my teeth', 'wash my face', 'get dressed', 'have breakfast'],
      grammar: {
        title: '句子密码 · 谁 + 动作',
        pattern: ['I / You / He / She / It', '+', '动作'],
        note: '先找到是谁，再说做什么。I 是我，You 是你或你们，He 是他，She 是她，It 是它（小机器人也可以用 It）。',
        extensions: [
          { label: '我', english: 'I get up.', chinese: '我起床。' },
          { label: '你 / 你们', english: 'You get up.', chinese: '你 / 你们起床。' },
          { label: '他', english: 'He gets up.', chinese: '他起床。' },
          { label: '她', english: 'She gets up.', chinese: '她起床。' },
          { label: '它 · 小机器人', english: 'It gets up.', chinese: '它起床。' }
        ],
        tip: '今天先发现 get → gets。早餐的 have → has 会换样子，不能写成 haves；其他变化在后面的单元里慢慢学。'
      },
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
      id: 'room', number: '22', name: 'My room', zh: '我的房间',
      scene: 'assets/room.svg', label: 'UNIT 22 · 房间线索',
      intro: '基地里的小物品换了位置。跟着位置词，帮探员整理房间。',
      words: ['on the desk', 'in the box', 'under the bed'],
      grammar: {
        title: '句子密码 · Where 找位置',
        pattern: ['Where', '+', 'is / are', '+', '物品？'],
        note: '本关用 Where 找位置。一个物品配 is，多个物品配 are；What 找物品、Whose 找主人作为可选拓展。',
        extensions: [
          { label: 'Where · 哪里', english: 'Where is the book?', answer: 'It is on the desk.', chinese: '书在哪里？它在书桌上。' },
          { label: 'What · 什么', english: 'What is it?', answer: 'It is a pencil.', chinese: '它是什么？它是一支铅笔。' },
          { label: 'Where · 多个物品', english: 'Where are the books?', answer: 'They are in the box.', chinese: '书在哪里？它们在盒子里。' },
          { label: 'Whose · 谁的', english: 'Whose book is it?', answer: 'It is her book.', chinese: '这是谁的书？这是她的书。' }
        ],
        tip: '先听问题词，再想它在问什么；听到 Where 就找位置，听到 What 就找物品。'
      },
      phonics: { letter: 'b', sample: 'book, box, bed', title: '听一听开头音', text: 'book、box、bed 都从 /b/ 开始。找到三个 /b/ 线索。' },
      tasks: [
        { type: 'listen', label: '第一条线索 · 听一听', title: 'Where is the book?', prompt: '听问题，找到书的位置。', audio: 'The book is on the desk.', options: [
          { icon: '🪑', visual: 'desk', text: 'on the desk', correct: true }, { icon: '📦', visual: 'box', text: 'in the box' }, { icon: '🛏️', visual: 'bed', text: 'under the bed' }
        ] },
        { type: 'build', label: '第二条线索 · 拼一拼', title: '把位置说清楚', prompt: '物品 + is + 位置，线索就完整了。', audio: 'The book is on the desk.', words: ['The book', 'is', 'on the desk.'], answer: ['The book', 'is', 'on the desk.'] },
        { type: 'speak', label: '第三条线索 · 说一说', title: '和搭档互相问答', prompt: '先听问题，再说出完整回答。', audio: 'Where is the ball? It is under the bed.', phrase: 'It is under the bed.' },
        { type: 'transfer', label: '最终线索 · 换一换', title: '盒子里还有什么？', prompt: '看图选择正确的句子。', audio: 'The pencil is in the box.', options: [
          { icon: '✏️', visual: 'box', text: 'The pencil is in the box.', correct: true }, { icon: '✏️', visual: 'desk', text: 'The pencil is on the desk.' }, { icon: '✏️', visual: 'bed', text: 'The pencil is under the bed.' }
        ] }
      ]
    }
  }, window.TownUnitContent || {});
  const unitOrder = window.GRAMMAR_ROADMAP.volumes.flatMap(function (volume) {
    return volume.units.map(function (entry) {
      const match = Object.values(units).find(function (unit) { return unit.name === entry[0]; });
      return match && match.id;
    }).filter(Boolean);
  });
  const TOTAL_UNITS = unitOrder.length;

  const defaultState = {
    activeProfile: 'fox',
    sound: true,
    progress: {
      fox: { completed: [], stages: {}, attempts: 0, wins: 0, last: '', reviewDue: {}, errors: {} },
      rabbit: { completed: [], stages: {}, attempts: 0, wins: 0, last: '', reviewDue: {}, errors: {} }
    }
  };
  let state = loadState();
  let currentUnit = null;
  let stageIndex = 0;
  let stageDone = false;
  let stageWrong = 0;
  let stageReported = new Set();
  let storageKey = STORAGE_KEY;
  let pageName = 'hub';
  let mediaRecorder = null;
  let recordUrl = '';
  let recordingRequested = false;
  let recordingStream = null;
  let recordingEpoch = 0;
  let speechVoices = [];
  let speechReady = false;

  const view = document.getElementById('view');
  const insight = document.getElementById('insight');
  const crumb = document.getElementById('crumb');

  function loadState(key) {
    try {
      const stored = JSON.parse(localStorage.getItem(key || STORAGE_KEY));
      if (!stored) return structuredClone(defaultState);
      const merged = Object.assign({}, defaultState, stored);
      merged.progress = {};
      Object.keys(profiles).forEach(function (id) {
        merged.progress[id] = Object.assign({}, defaultState.progress[id], (stored.progress && stored.progress[id]) || {});
        merged.progress[id].reviewDue = Object.assign({}, defaultState.progress[id].reviewDue, merged.progress[id].reviewDue || {});
        merged.progress[id].errors = Object.assign({}, defaultState.progress[id].errors, merged.progress[id].errors || {});
        merged.progress[id].stages = Object.assign({}, merged.progress[id].stages || {});
      });
      return merged;
    } catch (error) { return structuredClone(defaultState); }
  }

  function saveState() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); return true; }
    catch (_) {
      if (window.TownLocal) window.TownLocal.report(new Error('本机存储失败，本次学习进度未保存。请先导出备份并检查浏览器存储空间。'));
      return false;
    }
  }
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

  function initSpeech() {
    if (!('speechSynthesis' in window) || speechReady) return;
    speechReady = true;
    const refreshVoices = function () { speechVoices = window.speechSynthesis.getVoices() || []; };
    refreshVoices();
    if (window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
  }

  function speak(text) {
    if (!state.sound) return false;
    if (window.AndroidTts && typeof window.AndroidTts.speak === 'function') {
      window.AndroidTts.speak(String(text));
      return true;
    }
    if (window.TownAudio && window.TownAudio.play(text)) return true;
    if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) {
      const status = document.getElementById('cloud-status');
      if (status) status.textContent = '当前平板浏览器不支持网页朗读，请使用系统浏览器打开。';
      return false;
    }
    initSpeech();
    const isChinese = /[\u3400-\u9fff]/.test(text);
    const lang = isChinese ? 'zh-CN' : 'en-US';
    const candidates = speechVoices.filter(function (voice) { return voice.lang && voice.lang.toLowerCase().indexOf(isChinese ? 'zh' : 'en') === 0; });
    const voice = candidates.find(function (item) { return item.lang.toLowerCase() === lang.toLowerCase(); }) || candidates[0];
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.resume) window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(String(text));
      utterance.lang = lang;
      if (voice) utterance.voice = voice;
      utterance.rate = 0.76;
      utterance.pitch = 1.02;
      utterance.onerror = function () {
        const status = document.getElementById('cloud-status');
        if (status) status.textContent = '声音播放失败，请点右上角声音按钮测试，或检查平板静音开关。';
      };
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      const status = document.getElementById('cloud-status');
      if (status) status.textContent = '声音暂时不可用，请检查平板静音开关后重试。';
      return false;
    }
  }

  function setActiveNav(name) {
    pageName = name;
    if (window.TownRewards) window.TownRewards.unmount();
    document.querySelectorAll('.main-nav button').forEach(function (button) { button.classList.toggle('active', button.dataset.action === name); });
  }

  function renderProfiles() {
    updateReviewCount();
    document.getElementById('profiles').innerHTML = Object.values(profiles).map(function (profile) {
      const selected = profile.id === state.activeProfile;
      return '<button class="profile ' + (selected ? 'active' : '') + '" type="button" data-profile="' + profile.id + '" aria-pressed="' + selected + '"><img src="' + profile.image + '" alt="' + profile.name + '"><span><strong>' + profile.name + '</strong><small>' + profile.title + '</small></span>' + (selected ? '<span class="profile-check">●</span>' : '') + '</button>';
    }).join('');
    document.querySelectorAll('[data-profile]').forEach(function (button) { button.addEventListener('click', function () {
      stopActiveRecording(); state.activeProfile = button.dataset.profile; saveState();
      if (pageName === 'wallet') renderWallet();
      else if (pageName === 'roadmap') renderRoadmap();
      else if (pageName === 'review') renderReview();
      else if (pageName === 'parent') renderParent();
      else renderHub();
    }); });
  }

  function recommendedUnit(progress) {
    const due = dueUnits();
    if (due.length) return due[0];
    return nextUnit(progress) || unitOrder[0];
  }

  function nextUnit(progress) {
    return unitOrder.find(function (id) { return !progress.completed.includes(id); }) || '';
  }

  function renderInsight() {
    const profile = activeProfile();
    const progress = activeProgress();
    const completedCount = progress.completed.filter(function (id) { return units[id]; }).length;
    const percent = Math.round((completedCount / TOTAL_UNITS) * 100);
    const recommendation = recommendedUnit(progress);
    const recommendationTitle = dueUnits().length ? '复习 ' + units[recommendation].name : completedCount === TOTAL_UNITS ? '重玩 ' + units[recommendation].name : '开始 ' + units[recommendation].name;
    insight.innerHTML = '<div class="right-title">当前探员</div>' +
      '<div class="insight-profile"><img src="' + profile.image + '" alt=""><div><strong>' + profile.name + '</strong><span>' + profile.title + ' · 今日在线</span></div></div>' +
      '<div class="ring-wrap"><div class="ring" style="--progress:' + percent + '%"><strong>' + percent + '%</strong></div><div class="ring-copy"><strong>三册总进度</strong><span>已完成 ' + completedCount + ' / ' + TOTAL_UNITS + '<br>每次一关即可</span></div></div>' +
      '<div class="rule"></div><div class="side-panel-title">今日线索 <span>10—20分钟</span></div>' +
      '<div class="daily-task"><small>推荐任务</small><strong>' + recommendationTitle + '</strong><p>听一听、看一看，再把线索说给探员徽章听。</p><button type="button" data-action="start" data-unit="' + recommendation + '">进入任务 <span>→</span></button></div>' +
      '<div class="coop-note"><small>双人搭档提示</small><p>两个人可以轮换“听线索”和“说台词”。只有一个人时，系统会读出另一位探员的台词。</p></div>' +
      '<p class="source-note">三册单元名按已确认目录；未逐页核实的完整短句均为围绕主题编写的原创练习。</p>';
    insight.querySelectorAll('[data-action="start"]').forEach(function (button) { button.addEventListener('click', function () { startUnit(button.dataset.unit); }); });
  }

  function renderHub() {
    stopActiveRecording(); currentUnit = null; setActiveNav('hub'); crumb.textContent = '任务地图';
    renderProfiles(); renderInsight();
    const profile = activeProfile();
    const progress = activeProgress();
    const completeCount = progress.completed.filter(function (id) { return units[id]; }).length;
    const recommendation = recommendedUnit(progress);
    const nextId = nextUnit(progress);
    const cards = unitOrder.map(function (id) { return missionCard(units[id], progress.completed.includes(id), id === nextId); }).join('');
    view.innerHTML = '<div class="view-heading"><div><div class="eyebrow">小城探险 · 三册总地图</div><h1>' + profile.name + '，今天找哪条线索？</h1><p class="subline">选择一项任务开始。每一关都可以听、看、拼和说。</p></div><div class="overview-pill">已完成 ' + completeCount + ' / ' + TOTAL_UNITS + ' 个任务</div></div>' +
      '<section class="scene"><img class="scene-bg" src="assets/morning.svg" alt="晨光中的探员基地"><div class="scene-copy"><small>THE MORNING SIGNAL</small><h2>晨光信号<br>重新亮起</h2><p>两个探员需要找回散落在城市里的英语线索。</p><button type="button" class="primary-button" data-action="start" data-unit="' + recommendation + '"><i data-lucide="play">▶</i>' + (dueUnits().length ? '复习今日线索' : completeCount === TOTAL_UNITS ? '重玩第一关' : completeCount ? '继续下一关' : '开始第一条线索') + '</button></div><img class="scene-avatar" src="' + profiles.fox.image + '" alt=""><img class="scene-avatar partner" src="' + profiles.rabbit.image + '" alt=""></section>' +
      '<div class="section-title"><h2>全部 30 个任务</h2><span>一年级上 · 一年级下 · 二年级上</span></div>' +
      '<div class="mission-grid">' + cards + '</div>';
    bindHubEvents(); refreshIcons();
  }

  function missionCard(unit, done, isNext) {
    const status = done ? (dueUnits().includes(unit.id) ? '今日待复习' : '已完成，可重玩') : isNext ? '下一关 · 推荐' : unit.words.slice(0, 3).join(' · ');
    return '<button type="button" class="mission ' + (done ? 'completed' : '') + ' ' + (isNext ? 'next' : '') + '" data-action="start" data-unit="' + unit.id + '"><div class="mission-art"><img src="' + unit.scene + '" alt=""><span class="mission-theme-icon" aria-hidden="true">' + esc(unit.icon || '') + '</span><span class="mission-num">' + unit.number + '</span>' + (done ? '<span class="mission-status">✓ 已完成</span>' : isNext ? '<span class="mission-status next-status">下一关</span>' : '') + '</div><div class="mission-body"><span class="unit-label">' + unit.label + '</span><h3>' + unit.name + '</h3><p>' + unit.zh + ' · ' + status + '</p><div class="mission-bottom"><span>' + (done ? '重玩本关' : isNext ? '进入下一关' : '开始探险') + '</span><i data-lucide="' + (done ? 'rotate-ccw' : 'arrow-up-right') + '">↗</i></div></div></button>';
  }

  function bindHubEvents() {
    view.querySelectorAll('[data-action="start"]').forEach(function (button) { button.addEventListener('click', function () { startUnit(button.dataset.unit); }); });
  }

  function startUnit(unitId) {
    stopActiveRecording(); currentUnit = units[unitId];
    if (!currentUnit) { renderHub(); return; }
    const stages = activeProgress().stages[unitId] || [];
    const unfinished = currentUnit.tasks.findIndex(function (task) { return !stages.includes(task.type); });
    stageIndex = unfinished < 0 ? 0 : unfinished; stageDone = false; stageWrong = 0; stageReported = new Set(); setActiveNav('hub'); renderGame();
  }

  function renderGame() {
    const unit = currentUnit; const task = unit.tasks[stageIndex]; const progress = activeProgress();
    crumb.textContent = unit.name; renderProfiles(); renderInsight();
    view.innerHTML = '<div class="game-header"><div><button type="button" class="back-button" data-action="back"><i data-lucide="arrow-left">←</i>返回任务地图</button><div class="eyebrow">' + unit.label + '</div><h1>' + unit.name + ' · ' + unit.zh + '</h1></div><span class="mini-tag">线索 ' + (stageIndex + 1) + ' / ' + unit.tasks.length + '</span></div>' +
      '<div class="progress-header"><span>探险进度</span><span>' + Math.round((stageIndex / unit.tasks.length) * 100) + '%</span></div><div class="progress-track"><i style="width:' + Math.round((stageIndex / unit.tasks.length) * 100) + '%"></i></div>' +
      '<div class="game-story"><img src="' + activeProfile().image + '" alt=""><p>' + unit.intro + '</p><button type="button" class="story-audio" data-action="speak" data-speak="' + esc(unit.intro) + '" aria-label="播放中文任务说明" title="播放任务说明"><i data-lucide="volume-2">🔊</i></button></div>' +
      renderTask(task) + '<div id="teaching-host">' + window.TownTeaching.render(unit.id) + '</div>' + renderGrammar(unit.grammar) + renderPhonics(unit.phonics);
    bindGameEvents(task); refreshIcons();
    window.TownTeaching.bind(view.querySelector('#teaching-host'), unit.id, {
      profile: activeProfile(), speak: speak,
      completed: function (wrong) { completeStage('grammar', wrong); return stageRewardText('grammar'); },
      earned: (activeProgress().stages[unit.id] || []).includes('grammar')
    });
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
    const examples = (grammar.extensions || []).map(function (item) {
      const spokenText = item.english + (item.answer ? ' ' + item.answer : '');
      return '<li class="grammar-example"><div class="grammar-example-copy"><span class="grammar-label">' + esc(item.label) + '</span><strong>' + esc(item.english) + '</strong>' + (item.answer ? '<span class="grammar-answer">' + esc(item.answer) + '</span>' : '') + '<small>' + esc(item.chinese) + '</small></div><button type="button" data-action="speak" data-speak="' + esc(spokenText) + '" aria-label="播放：' + esc(spokenText) + '" title="播放这组英语"><i data-lucide="volume-2">🔊</i><span>听一听</span></button></li>';
    }).join('');
    return '<section class="grammar-card" aria-label="' + esc(grammar.title) + '"><div class="grammar-head"><div><span class="grammar-kicker">可选拓展 · 不影响通关</span><h3>' + esc(grammar.title) + '</h3><p>' + esc(grammar.note) + '</p></div><div class="grammar-pattern">' + grammar.pattern.map(function (part) { return '<span>' + esc(part) + '</span>'; }).join('') + '</div></div><ul class="grammar-example-list">' + examples + '</ul><p class="grammar-tip"><strong>探员提示</strong>' + esc(grammar.tip) + '</p></section>';
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
      if (stageDone) return;
      activeProgress().attempts += 1;
      view.querySelectorAll('.answer').forEach(function (option) { option.disabled = true; });
      button.classList.add(correct ? 'correct' : 'wrong');
      if (!correct) { stageWrong += 1; activeProgress().errors[currentUnit.id] = (activeProgress().errors[currentUnit.id] || 0) + 1; saveState(); feedback.hidden = false; feedback.className = 'feedback error'; feedback.innerHTML = '<strong>再听一次，线索还在这里。</strong><button type="button" data-action="retry">重新选择</button>'; feedback.querySelector('[data-action="retry"]').addEventListener('click', function () { renderGame(); }); return; }
      stageDone = true; activeProgress().wins += 1; completeStage(currentUnit.tasks[stageIndex].type, stageWrong); feedback.hidden = false; feedback.className = 'feedback success'; feedback.innerHTML = '<strong>找到了！' + stageRewardText(currentUnit.tasks[stageIndex].type) + '</strong><button type="button" data-action="next">下一条线索 →</button>'; feedback.querySelector('[data-action="next"]').addEventListener('click', nextStage); saveState();
    }); });
  }

  function bindBuildEvents(task) {
    const area = document.getElementById('word-area'); const bank = document.getElementById('word-bank'); const check = view.querySelector('[data-action="check-words"]'); let chosen = [];
    bank.querySelectorAll('.word-chip').forEach(function (button) { button.addEventListener('click', function () { if (button.classList.contains('placed')) return; chosen.push(button.dataset.word); button.classList.add('placed'); area.querySelector('.word-placeholder')?.remove(); const chip = document.createElement('span'); chip.className = 'word-chip placed'; chip.textContent = button.dataset.word; area.appendChild(chip); check.disabled = false; }); });
    view.querySelector('[data-action="clear-words"]').addEventListener('click', function () { renderGame(); });
    check.addEventListener('click', function () { const feedback = document.getElementById('feedback'); const correct = chosen.length === task.answer.length && chosen.join('|') === task.answer.join('|'); activeProgress().attempts += 1; if (!correct) { stageWrong += 1; activeProgress().errors[currentUnit.id] = (activeProgress().errors[currentUnit.id] || 0) + 1; saveState(); feedback.hidden = false; feedback.className = 'feedback error'; feedback.innerHTML = '<strong>顺序还需要调整。想想谁先出现，再听一遍示范。</strong><button type="button" data-action="reset-build">重新拼</button>'; feedback.querySelector('[data-action="reset-build"]').addEventListener('click', function () { renderGame(); }); return; } stageDone = true; activeProgress().wins += 1; completeStage('build', stageWrong); feedback.hidden = false; feedback.className = 'feedback success'; feedback.innerHTML = '<strong>句子完整！' + stageRewardText('build') + '</strong><button type="button" data-action="next">下一条线索 →</button>'; feedback.querySelector('[data-action="next"]').addEventListener('click', nextStage); check.disabled = true; saveState(); });
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
      feedback.innerHTML = '<strong>台词已完成，不自动判断发音。' + stageRewardText('speak') + '</strong><button type="button" data-action="next">下一条线索 →</button>';
      feedback.querySelector('[data-action="next"]').addEventListener('click', nextStage);
      completeStage('speak', 0);
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

  function nextStage() { if (!stageDone) return; stopActiveRecording(); if (stageIndex >= currentUnit.tasks.length - 1) { finishUnit(); return; } stageIndex += 1; stageDone = false; stageWrong = 0; stageReported = new Set(); renderGame(); }

  function stagePoints(stage) { return ({ listen: 2, build: 3, speak: 2, transfer: 4, grammar: 5 })[stage] || 0; }

  function stageRewardText(stage) {
    return '首次奖励 ' + stagePoints(stage) + ' 分，重玩不重复发分；本机保存成功后可在积分页查看。';
  }

  function completeStage(stage, wrong) {
    const progress = activeProgress();
    if (stageReported.has(stage)) return;
    stageReported.add(stage);
    const stages = progress.stages[currentUnit.id] || [];
    if (!stages.includes(stage)) progress.stages[currentUnit.id] = Array.from(new Set(stages.concat(stage)));
    saveState();
    if (window.TownLocal) window.TownLocal.complete(state.activeProfile, currentUnit.id, stage, wrong).catch(function (error) {
      stageReported.delete(stage);
      window.TownLocal.report(error);
    });
  }

  function renderWallet() {
    stopActiveRecording(); currentUnit = null; setActiveNav('wallet'); crumb.textContent = '积分心愿'; renderProfiles(); renderInsight();
    window.TownRewards.mount(view, {
      profile: activeProfile,
      backup: function () { return structuredClone(state); },
      legacy: legacyProgress,
      units: function () { return unitOrder.map(function (id) { return { id: id, number: units[id].number, name: units[id].name, completed: false }; }); },
      progress: function (role) { return structuredClone(state.progress[role]); },
      resetProgress: async function (role, ids) {
        const result = await window.TownLocal.resetLearning(role, ids);
        const progress = state.progress[role];
        const resetIds = new Set(ids);
        resetIds.forEach(function (unitId) {
          delete progress.stages[unitId];
          delete progress.reviewDue[unitId];
          delete progress.errors[unitId];
        });
        progress.completed = progress.completed.filter(function (unitId) { return !resetIds.has(unitId); });
        progress.last = progress.completed.length ? units[progress.completed[progress.completed.length - 1]].name : '';
        saveState();
        currentUnit = null;
        return result;
      }
    });
    refreshIcons();
  }

  function legacyProgress(role) { return loadState(STORAGE_KEY).progress[role]; }

  function applyCloud(snapshot, pending) {
    const targetKey = STORAGE_KEY + ':family:' + snapshot.family.familyId;
    if (storageKey !== targetKey) {
      const previousProfile = state.activeProfile, previousSound = state.sound;
      storageKey = targetKey; state = loadState(targetKey);
      state.activeProfile = previousProfile; state.sound = previousSound;
    }
    snapshot.family.children.forEach(function (child) {
      if (!profiles[child.roleKey]) return;
      const events = snapshot.events.filter(function (event) { return event.child_id === child.id; }).map(function (event) {
        return { unit: event.unit_id, stage: event.stage_id, wrong: event.wrong_count, time: event.client_completed_at || event.received_at };
      }).concat((pending || []).filter(function (event) { return event.childId === child.id; }).map(function (event) {
        return { unit: event.unit, stage: event.stage, wrong: event.wrongCount, time: event.completedAt };
      }));
      const legacy = (snapshot.legacy || []).find(function (entry) { return entry.child_id === child.id; });
      const p = structuredClone(defaultState.progress[child.roleKey]);
      if (legacy) Object.assign(p, legacy.progress);
      p.stages = {}; p.errors = Object.assign({}, p.errors); p.reviewDue = Object.assign({}, p.reviewDue);
      p.completed = (p.completed || []).filter(function (id) { return units[id]; });
      const latest = {};
      events.forEach(function (event) {
        if (!units[event.unit]) return;
        p.stages[event.unit] = Array.from(new Set((p.stages[event.unit] || []).concat(event.stage)));
        if (event.stage !== 'speak' && event.stage !== 'grammar') { p.wins += 1; p.attempts += 1 + (event.wrong || 0); }
        p.errors[event.unit] = (p.errors[event.unit] || 0) + (event.wrong || 0);
        latest[event.unit] = Math.max(latest[event.unit] || 0, Date.parse(event.time) || 0);
      });
      Object.keys(p.stages).forEach(function (id) {
        if (units[id].tasks.every(function (task) { return p.stages[id].includes(task.type); })) {
          if (!p.completed.includes(id)) p.completed.push(id);
          p.reviewDue[id] = latest[id] + 86400000;
        }
      });
      const lastUnit = Object.keys(latest).sort(function (a, b) { return latest[b] - latest[a]; })[0];
      if (lastUnit) p.last = units[lastUnit].name;
      state.progress[child.roleKey] = p;
    });
    saveState(); renderProfiles(); renderInsight();
    if (!currentUnit && pageName === 'hub') renderHub();
    if (!currentUnit && pageName === 'parent') renderParent();
    if (!currentUnit && pageName === 'review') renderReview();
    if (!currentUnit && pageName === 'roadmap') renderRoadmap();
  }

  function resetCloudView() {
    storageKey = STORAGE_KEY; state = loadState();
    stopActiveRecording(); currentUnit = null;
    if (pageName === 'wallet') { renderProfiles(); renderInsight(); }
    else if (pageName === 'roadmap') renderRoadmap();
    else if (pageName === 'review') renderReview();
    else if (pageName === 'parent') renderParent();
    else renderHub();
  }

  function finishUnit() { const progress = activeProgress(); if (progress.completed.indexOf(currentUnit.id) < 0) progress.completed.push(currentUnit.id); progress.last = currentUnit.name; progress.reviewDue[currentUnit.id] = Date.now() + 24 * 60 * 60 * 1000; saveState(); renderComplete(); }

  function renderComplete() {
    const unit = currentUnit; const index = unitOrder.indexOf(unit.id); const nextId = index >= 0 && index < unitOrder.length - 1 ? unitOrder[index + 1] : '';
    crumb.textContent = '任务完成'; renderProfiles(); renderInsight(); view.innerHTML = '<div class="game-header"><div><button type="button" class="back-button" data-action="back"><i data-lucide="arrow-left">←</i>返回任务地图</button><div class="eyebrow">MISSION COMPLETE</div><h1>' + unit.name + ' · 线索归档</h1></div></div><div class="complete"><div class="complete-badge">✦</div><h2>这条线索归队了</h2><p>' + activeProfile().name + ' 完成了听音、拼句和角色表达。下一次打开，可以直接复习这组词语。</p><div class="complete-actions"><button type="button" class="primary-button" data-action="next-unit"><i data-lucide="arrow-right">→</i>' + (nextId ? '进入 ' + esc(units[nextId].name) : '回到任务地图') + '</button><button type="button" class="outline-button" data-action="replay"><i data-lucide="rotate-ccw">↺</i>再玩一次</button></div></div><div class="phonics"><div class="phonics-mark">✓</div><div><strong>明日复习已安排</strong><p>明天会出现一条轻量复习线索。先休息，探员。</p></div></div>';
    const back = view.querySelector('[data-action="back"]'); back.addEventListener('click', renderHub);
    view.querySelector('[data-action="replay"]').addEventListener('click', function () { startUnit(unit.id); });
    view.querySelector('[data-action="next-unit"]').addEventListener('click', function () { if (nextId) startUnit(nextId); else renderHub(); });
    refreshIcons();
  }

  function renderRoadmap() {
    stopActiveRecording(); currentUnit = null; setActiveNav('roadmap'); crumb.textContent = '学习路线'; renderProfiles(); renderInsight();
    const roadmap = window.GRAMMAR_ROADMAP;
    const volumes = roadmap.volumes.map(function (volume) {
      const volumeOffset = roadmap.volumes.indexOf(volume) * 10;
      const nextId = nextUnit(activeProgress());
      const rows = volume.units.map(function (unit, index) {
        const playable = Object.values(units).find(function (entry) { return entry.name === unit[0]; });
        const playableId = playable && playable.id;
        const completed = activeProgress().completed.includes(playableId);
        const isNext = playableId === nextId;
        return '<div class="roadmap-unit playable ' + (completed ? 'completed' : '') + ' ' + (isNext ? 'next' : '') + '"><span class="roadmap-number">' + String(volumeOffset + index + 1).padStart(2, '0') + '</span><div><h3>' + esc(unit[0]) + '<b>' + (completed ? '已完成 · 可重玩' : isNext ? '下一关 · 推荐' : '待探索') + '</b></h3><p><strong>主线：</strong>' + esc(unit[1]) + '</p><p><strong>演示：</strong>' + esc(unit[2]) + '</p><p><strong>拓展：</strong>' + esc(unit[3]) + '</p></div><button type="button" class="outline-button" data-roadmap-unit="' + playableId + '">' + (completed ? '重玩' : isNext ? '进入下一关' : '进入') + '</button></div>';
      }).join('');
      return '<section class="roadmap-volume"><header><div><span>' + esc(volume.label) + '</span><h2>' + esc(volume.stage) + '</h2></div><strong>10 个单元</strong></header><div class="roadmap-list">' + rows + '</div></section>';
    }).join('');
    view.innerHTML = '<div class="view-heading"><div><div class="eyebrow">30-UNIT ROADMAP · 三册总路线</div><h1>每个单元，只发现一条句子密码</h1><p class="subline">' + esc(roadmap.principle) + '</p></div><div class="overview-pill">30 个单元均可进入</div></div><div class="roadmap-note">三册共 <strong>30 个探索单元</strong>，每关含听音、拼句、角色表达、场景迁移和可选语法挑战。</div>' + volumes;
    view.querySelectorAll('[data-roadmap-unit]').forEach(function (button) { button.addEventListener('click', function () { startUnit(button.dataset.roadmapUnit); }); });
    refreshIcons();
  }

  function renderReview() { stopActiveRecording(); currentUnit = null; setActiveNav('review'); crumb.textContent = '今日复习'; renderProfiles(); renderInsight(); const ids = dueUnits(); const cards = ids.map(function (id) { const unit = units[id]; return '<button type="button" class="mission" data-action="review-unit" data-unit="' + id + '"><div class="mission-art"><img src="' + unit.scene + '" alt=""><span class="mission-num">复习</span></div><div class="mission-body"><span class="unit-label">' + unit.label + '</span><h3>' + unit.name + '</h3><p>重玩本关，巩固听音、拼句和表达。</p><div class="mission-bottom"><span>重玩本关</span><i data-lucide="arrow-up-right">↗</i></div></div></button>'; }).join(''); view.innerHTML = '<div class="view-heading"><div><div class="eyebrow">REVIEW DESK · 今日复习</div><h1>把线索再带回场景</h1><p class="subline">完成后可以重玩整关，复习过的关卡将在次日再次提醒。</p></div></div>' + (cards ? '<div class="mission-grid">' + cards + '</div>' : '<div class="review-empty"><div class="big-icon">☀</div><h2>今天还没有待复习线索</h2><p>完成一项任务，明天这里会出现待复习的关卡。</p><button type="button" class="primary-button" data-action="start" data-unit="morning">开始第一关 <i data-lucide="arrow-right">→</i></button></div>'); view.querySelectorAll('[data-action="review-unit"], [data-action="start"]').forEach(function (button) { button.addEventListener('click', function () { startUnit(button.dataset.unit); }); }); refreshIcons(); }

  function renderParent() {
    stopActiveRecording(); currentUnit = null; setActiveNav('parent'); crumb.textContent = '家长看板'; renderProfiles(); renderInsight();
    const rows = Object.values(profiles).map(function (profile) {
      const p = state.progress[profile.id];
      const completed = p.completed.filter(function (id) { return units[id]; }).length;
      const percent = Math.round((completed / TOTAL_UNITS) * 100);
      const accuracy = p.attempts ? Math.min(100, Math.round((p.wins / p.attempts) * 100)) : 0;
      const errors = Object.keys(p.errors || {}).filter(function (id) { return units[id] && p.errors[id]; }).map(function (id) { return units[id].name + ' ' + p.errors[id] + ' 次'; }).join(' · ') || '暂无';
      return '<div class="parent-profile"><img src="' + profile.image + '" alt=""><div><h2>' + profile.name + ' <span class="unit-label">' + profile.title + '</span></h2><label><span>三册进度</span><span class="progress-track" style="width:110px"><i style="width:' + percent + '%"></i></span><strong>' + percent + '%</strong></label><p class="subline">已完成 ' + completed + ' / ' + TOTAL_UNITS + ' 个任务 · 最近：' + (p.last || '还未开始') + '</p><p class="stat-line">答题 ' + p.attempts + ' 次 · 答对 ' + p.wins + ' 次 · 正确率 ' + (p.attempts ? accuracy + '%' : '暂无记录') + '</p><p class="stat-line">需要再练：' + errors + '</p></div></div>';
    }).join('');
    view.innerHTML = '<div class="view-heading"><div><div class="eyebrow">PARENT VIEW · 低干预陪伴</div><h1>两个探员，各自的成长轨迹</h1><p class="subline">这里只显示学习趋势，不做兄妹排名。</p></div></div><div class="parent-grid"><div class="parent-panel reward-management-entry"><h3>心愿与奖励管理</h3><p>给孩子心愿填写积分，或由家长新增、上架和下架奖励。</p><button type="button" class="secondary-button" data-action="manage-rewards">管理心愿与奖励</button></div><div class="parent-panel"><h3>建议陪伴</h3><p>每周挑一次任务结尾，让孩子把角色台词说给您听。每天无需陪同完成。</p></div></div><div class="parent-panel" style="margin-top:13px"><h3>探员记录</h3>' + rows + '</div><div class="privacy-note">发音不自动评分；录音仅在本页临时回放，不上传或保存，离开页面即删除。孩子可不录音直接继续。</div>';
    view.querySelector('[data-action="manage-rewards"]').addEventListener('click', function () { renderWallet(); window.TownRewards.parent(); });
    refreshIcons();
  }

  function shuffle(array) { for (let i = array.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); const temp = array[i]; array[i] = array[j]; array[j] = temp; } return array; }

  document.querySelectorAll('[data-action="hub"], [data-action="roadmap"], [data-action="review"], [data-action="wallet"], [data-action="parent"]').forEach(function (button) { button.addEventListener('click', function () { if (button.dataset.action === 'hub') renderHub(); if (button.dataset.action === 'roadmap') renderRoadmap(); if (button.dataset.action === 'review') renderReview(); if (button.dataset.action === 'wallet') renderWallet(); if (button.dataset.action === 'parent') renderParent(); }); });
  initSpeech();
  document.querySelector('[data-action="sound"]').addEventListener('click', function () {
    state.sound = !state.sound; saveState(); document.querySelector('.sound-button').classList.toggle('off', !state.sound);
    if (!state.sound && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    if (state.sound) speak('Hello, explorers!');
  });
  document.querySelector('.sound-button').classList.toggle('off', !state.sound);
  window.addEventListener('pagehide', stopActiveRecording);
  document.getElementById('today').textContent = todayText();
  renderHub();
  window.TownLocal.init();
}());

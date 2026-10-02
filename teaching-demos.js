(function () {
  'use strict';

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function morning() {
    return '<section class="teaching-demo morning-demo" aria-label="My morning 句型演示">' +
      '<div class="demo-heading"><div><span class="grammar-kicker">点一点，看句子变化</span><h3>谁在做动作？</h3><p>先看探员是谁，再听动作词的小尾巴。</p></div><span class="demo-badge">角色镜头</span></div>' +
      '<div class="demo-stage"><span class="demo-scene-icon" aria-hidden="true">🛏️</span><div class="demo-character" id="morning-character">🦊</div><div class="demo-speech" id="morning-speech">I get up.</div><div class="demo-action" id="morning-action">get up</div></div>' +
      '<div class="demo-choice" role="group" aria-label="选择主语">' +
      ['I', 'You', 'He', 'She', 'It'].map(function (subject) { return '<button type="button" class="demo-choice-button" data-demo-subject="' + subject + '">' + subject + '</button>'; }).join('') +
      '</div><div class="demo-choice" role="group" aria-label="选择动作"><button type="button" data-morning-action="up">🛏️ 起床</button><button type="button" data-morning-action="dressed">👕 穿衣</button><button type="button" data-morning-action="breakfast">🍞 早餐（拓展）</button></div><p class="demo-explain" id="morning-explain">I 是我。说自己时，动作词保持原样：get up。</p>' +
      '<div class="demo-choice"><button type="button" data-demo-audio="explain">🔊 听中文讲解</button><button type="button" data-demo-audio="sentence">🔊 听英语句子</button></div>' +
      '<details class="demo-extra"><summary>更多角色 · we / they</summary><p>两个角色一起说自己：We get up. 从旁边看他们：They get up. we 和 they 后面保持 get。人称改变的是说话角度。</p></details>' +
      '<div class="demo-challenge"><strong>可选挑战 · 首次成功 5 分</strong><p>🐰 她每天穿衣：She ___ dressed.</p><div><button type="button" data-demo-answer="wrong">🔊 get</button><button type="button" data-demo-answer="correct">🔊 gets</button></div><span class="demo-feedback" role="status"></span></div></section>';
  }

  function room() {
    return '<section class="teaching-demo room-demo" aria-label="My room 单复数演示">' +
      '<div class="demo-heading"><div><span class="grammar-kicker">点击物品，看句子变化</span><h3>一件还是多件？</h3><p>物品数量变化时，book 和 is 也会一起变化。</p></div><span class="demo-badge">房间扫描</span></div>' +
      '<div class="room-demo-stage" id="room-demo-stage"><div class="demo-desk"><span>桌面</span></div><div class="demo-box"><span>盒子</span></div><div class="demo-bed"><span>床</span></div><div class="demo-books" id="room-demo-books">📘</div><div class="demo-label" id="room-demo-label">one book</div></div>' +
      '<div class="demo-choice" role="group" aria-label="选择物品数量"><button type="button" class="demo-choice-button active" data-room-count="one">一本</button><button type="button" class="demo-choice-button" data-room-count="many">两本</button></div>' +
      '<div class="demo-choice" role="group" aria-label="移动书本"><button type="button" data-room-position="desk">桌上 on</button><button type="button" data-room-position="box">盒内 in</button><button type="button" data-room-position="bed">床下 under</button></div><div class="room-sentence" id="room-demo-sentence">Where is the book? <strong>It is on the desk.</strong></div>' +
      '<p class="demo-explain" id="room-demo-explain">一本书是一个物品：book 配 is。</p>' +
      '<div class="demo-choice"><button type="button" data-demo-audio="explain">🔊 听中文讲解</button><button type="button" data-demo-audio="sentence">🔊 听英语句子</button></div>' +
      '<details class="demo-extra"><summary>侦探工具箱 · What / Where / Whose</summary><p>点工具，看它想找哪一种线索。</p><div class="demo-choice"><button type="button" data-room-tool="what">🔍 What</button><button type="button" data-room-tool="where">🗺️ Where</button><button type="button" data-room-tool="whose">🏷️ Whose</button></div><div class="demo-tool-scene" id="room-tool-scene">🔍 📘</div><p id="room-tool-copy">What is it? It is a book. 放大镜看物品：它是什么？</p><div class="demo-choice"><button type="button" data-room-owner="my">我的 my</button><button type="button" data-room-owner="your">你的 your</button><button type="button" data-room-owner="his">他的 his</button><button type="button" data-room-owner="her">她的 her</button></div><p id="room-owner-copy">点姓名贴，看这本书属于谁。</p><button type="button" class="outline-button" data-demo-audio="tool">🔊 听工具讲解</button></details>' +
      '<div class="demo-challenge"><strong>可选挑战 · 首次成功 5 分</strong><p>📘📘 两本书：Where ___ the books?</p><div><button type="button" data-demo-answer="wrong">🔊 is</button><button type="button" data-demo-answer="correct">🔊 are</button></div><span class="demo-feedback" role="status"></span></div></section>';
  }

  function generic(unitId) {
    var unit = window.TownUnitContent && window.TownUnitContent[unitId];
    if (!unit) return '';
    var demo = unit.demo;
    return '<section class="teaching-demo generic-demo" aria-label="' + esc(unit.name) + ' 互动演示">' +
      '<div class="demo-heading"><div><span class="grammar-kicker">点场景，让句子动起来</span><h3>' + esc(unit.grammar.title) + '</h3><p>每次只观察一个变化，再跟着角色读。</p></div><span class="demo-badge">互动小剧场</span></div>' +
      '<div class="generic-demo-stage"><div class="generic-demo-icon" id="generic-demo-icon">' + esc(demo.steps[0][0]) + '</div><div><span id="generic-demo-label">' + esc(demo.steps[0][1]) + '</span><strong id="generic-demo-sentence">' + esc(demo.steps[0][2]) + '</strong></div></div>' +
      '<div class="demo-choice" role="group" aria-label="切换演示">' + demo.steps.map(function (step, index) { return '<button type="button" class="' + (index ? '' : 'active') + '" data-generic-step="' + index + '">' + esc(step[0] + ' ' + step[1]) + '</button>'; }).join('') + '</div>' +
      '<p class="demo-explain" id="generic-demo-explain">' + esc(demo.steps[0][3]) + '</p>' +
      '<div class="demo-choice"><button type="button" data-demo-audio="explain">🔊 听中文讲解</button><button type="button" data-demo-audio="sentence">🔊 听英语句子</button></div>' +
      '<details class="demo-extra"><summary>可选拓展 · 再往前一步</summary><p><strong>' + esc(demo.extra[0]) + '</strong></p><p>' + esc(demo.extra[1]) + '</p><button type="button" class="outline-button" data-demo-audio="extra">🔊 听拓展例句</button></details>' +
      '<div class="demo-challenge"><strong>可选挑战 · 首次成功 5 分</strong><p>' + esc(demo.quiz[0]) + '</p><div><button type="button" data-demo-answer="wrong">🔊 ' + esc(demo.quiz[1]) + '</button><button type="button" data-demo-answer="correct">🔊 ' + esc(demo.quiz[2]) + '</button></div><span class="demo-feedback" role="status"></span></div></section>';
  }

  function render(unitId) { return unitId === 'morning' ? morning() : unitId === 'room' ? room() : generic(unitId); }

  function bind(root, unitId, api) {
    if (!root) return;
    var sentence = '', explanation = '', toolExplanation = '';
    if (unitId !== 'morning' && unitId !== 'room') {
      var unit = window.TownUnitContent && window.TownUnitContent[unitId];
      if (!unit) return;
      var selected = 0;
      sentence = unit.demo.steps[0][2]; explanation = unit.demo.steps[0][3];
      function updateGeneric(index) {
        selected = index;
        var step = unit.demo.steps[index]; sentence = step[2]; explanation = step[3];
        root.querySelector('#generic-demo-icon').textContent = step[0];
        root.querySelector('#generic-demo-label').textContent = step[1];
        root.querySelector('#generic-demo-sentence').textContent = step[2];
        root.querySelector('#generic-demo-explain').textContent = step[3];
        root.querySelectorAll('[data-generic-step]').forEach(function (button) { button.classList.toggle('active', Number(button.dataset.genericStep) === selected); });
      }
      root.querySelectorAll('[data-generic-step]').forEach(function (button) { button.addEventListener('click', function () { updateGeneric(Number(button.dataset.genericStep)); api.speak(sentence); }); });
      root.querySelectorAll('[data-demo-audio]').forEach(function (button) { button.addEventListener('click', function () {
        api.speak(button.dataset.demoAudio === 'sentence' ? sentence : button.dataset.demoAudio === 'extra' ? unit.demo.extra[0] : explanation);
      }); });
      var genericWrong = 0;
      root.querySelectorAll('[data-demo-answer]').forEach(function (button) {
        button.disabled = Boolean(api.earned);
        button.addEventListener('click', function () {
          var feedback = root.querySelector('.demo-feedback');
          if (button.dataset.demoAnswer === 'wrong') { genericWrong += 1; button.classList.add('wrong'); feedback.textContent = '再切换一次场景看看，不扣分。'; api.speak(unit.demo.quiz[1]); return; }
          root.querySelectorAll('[data-demo-answer]').forEach(function (item) { item.disabled = true; });
          button.classList.add('correct'); api.speak(unit.demo.quiz[2]);
          feedback.textContent = '挑战完成！' + (api.earned ? '' : (api.completed(genericWrong) || ''));
        });
      });
      if (api.earned) root.querySelector('.demo-feedback').textContent = '这项加分挑战已经完成。';
      return;
    }
    if (unitId === 'morning') {
      var copy = {
        I: ['🦊', 'I get up.', 'I 是我。说自己时，动作词保持原样：get up。'],
        You: ['🐰', 'You get up.', 'You 是你或你们。动作词保持原样：get up。'],
        He: ['🦊', 'He gets up.', 'He 是他。动作词加上小尾巴 s：get → gets。'],
        She: ['🐰', 'She gets up.', 'She 是她。动作词加上小尾巴 s：get → gets。'],
        It: ['🤖', 'It gets up.', 'It 可以指小机器人。动作词加上小尾巴 s：get → gets。']
      };
      var subject = 'I', action = 'up';
      function updateMorning() {
        var third = ['He', 'She', 'It'].includes(subject);
        var base = action === 'breakfast' ? 'have' : 'get', verb = third ? (base === 'have' ? 'has' : 'gets') : base;
        var end = { up: 'up', dressed: 'dressed', breakfast: 'breakfast' }[action];
        var meaning = { I: '我在说自己', You: '我在对你说', He: '搭档指着男探员说他', She: '搭档指着女探员说她', It: '搭档指着小机器人说它' }[subject];
        sentence = subject + ' ' + verb + ' ' + end + '.';
        explanation = meaning + '。' + (third ? (base === 'have' ? '早餐的 have 要换成 has，不能只加 s。' : '经常做的这个动作，get 带上小尾巴 s，变成 gets。') : '这个动作词保持 ' + base + '。');
        var actorImage = subject === 'I' ? api.profile.image : subject === 'She' || subject === 'You' ? 'assets/rabbit.svg' : 'assets/fox.svg';
        root.querySelector('#morning-character').innerHTML = subject === 'It' ? '🤖' : '<img src="' + actorImage + '" alt="' + esc(subject) + '">';
        root.querySelector('#morning-speech').innerHTML = '<span>' + subject + '</span> ' + (third && base === 'get' ? 'get<span class="verb-tail">s</span>' : '<span class="verb-highlight">' + verb + '</span>') + ' ' + end + '.';
        root.querySelector('#morning-action').textContent = third ? base + ' → ' + verb : base;
        root.querySelector('#morning-explain').textContent = explanation;
        root.querySelector('.demo-scene-icon').textContent = { up: '🛏️', dressed: '👕', breakfast: '🍞' }[action];
        root.querySelectorAll('[data-demo-subject]').forEach(function (item) { item.classList.toggle('active', item.dataset.demoSubject === subject); item.setAttribute('aria-pressed', item.dataset.demoSubject === subject); });
        root.querySelectorAll('[data-morning-action]').forEach(function (item) { item.classList.toggle('active', item.dataset.morningAction === action); });
        var actor = root.querySelector('#morning-character'); actor.classList.remove('actor-move'); void actor.offsetWidth; actor.classList.add('actor-move');
      }
      root.querySelectorAll('[data-demo-subject]').forEach(function (button) { button.addEventListener('click', function () { subject = button.dataset.demoSubject; updateMorning(); api.speak(sentence); }); });
      root.querySelectorAll('[data-morning-action]').forEach(function (button) { button.addEventListener('click', function () { action = button.dataset.morningAction; updateMorning(); api.speak(sentence); }); });
      updateMorning();
    } else {
      var many = false, position = 'desk';
      function updateRoom() {
        var phrase = { desk: 'on the desk', box: 'in the box', bed: 'under the bed' }[position];
        var verb = many ? 'are' : 'is', noun = many ? 'books' : 'book';
        sentence = 'Where ' + verb + ' the ' + noun + '? ' + (many ? 'They' : 'It') + ' ' + verb + ' ' + phrase + '.';
        explanation = (many ? '两本书是多个物品，book 带上 s，is 换成 are，用 they 说它们。' : '一本书是一个物品，book 配 is，用 it 说它。') + { desk: 'on 是在桌面上。', box: 'in 是在盒子里面。', bed: 'under 是在床的下面。' }[position];
        root.querySelector('#room-demo-stage').dataset.position = position;
        root.querySelector('#room-demo-books').textContent = many ? '📘📘' : '📘';
        root.querySelector('#room-demo-label').textContent = many ? 'two books' : 'one book';
        root.querySelector('#room-demo-sentence').innerHTML = 'Where <span class="verb-highlight">' + verb + '</span> the ' + noun + '? <strong>' + (many ? 'They' : 'It') + ' <span class="verb-highlight">' + verb + '</span> ' + phrase + '.</strong>';
        root.querySelector('#room-demo-explain').textContent = explanation;
        root.querySelectorAll('[data-room-count]').forEach(function (item) { var selected = (item.dataset.roomCount === 'many') === many; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', selected); });
        root.querySelectorAll('[data-room-position]').forEach(function (item) { item.classList.toggle('active', item.dataset.roomPosition === position); });
      }
      root.querySelectorAll('[data-room-count]').forEach(function (button) { button.addEventListener('click', function () { many = button.dataset.roomCount === 'many'; updateRoom(); api.speak(sentence); }); });
      root.querySelectorAll('[data-room-position]').forEach(function (button) { button.addEventListener('click', function () { position = button.dataset.roomPosition; updateRoom(); api.speak(sentence); }); });
      var tools = {
        what: ['🔍 📘', 'What is it? It is a book.', '放大镜想找物品是什么，所以用 What。'],
        where: ['🗺️ 📘 → 🪑', 'Where is it? It is on the desk.', '地图想找物品在哪里，所以用 Where。'],
        whose: ['🏷️ 📘 → 🐰', 'Whose book is it? It is her book.', '姓名贴想找书的主人是谁，所以用 Whose。']
      };
      root.querySelectorAll('[data-room-tool]').forEach(function (button) { button.addEventListener('click', function () { var data = tools[button.dataset.roomTool]; root.querySelector('#room-tool-scene').textContent = data[0]; root.querySelector('#room-tool-copy').textContent = data[1] + ' ' + data[2]; toolExplanation = data[2]; api.speak(data[1]); }); });
      root.querySelectorAll('[data-room-owner]').forEach(function (button) { button.addEventListener('click', function () { var owner = button.dataset.roomOwner; root.querySelector('#room-tool-scene').textContent = '🏷️ ' + { my: '🦊 我', your: '🐰 你', his: '🦊 他', her: '🐰 她' }[owner] + ' → 📘'; root.querySelector('#room-owner-copy').textContent = 'It is ' + owner + ' book. ' + button.textContent + '，姓名贴要贴在 book 前面。'; toolExplanation = button.textContent + '，这个词放在物品名 book 的前面，告诉我们是谁的书。'; api.speak('It is ' + owner + ' book.'); }); });
      toolExplanation = tools.what[2]; updateRoom();
    }
    root.querySelectorAll('[data-demo-audio]').forEach(function (button) { button.addEventListener('click', function () { api.speak(button.dataset.demoAudio === 'sentence' ? sentence : button.dataset.demoAudio === 'tool' ? toolExplanation : explanation); }); });
    var wrong = 0;
    root.querySelectorAll('[data-demo-answer]').forEach(function (button) {
      button.disabled = Boolean(api.earned);
      button.addEventListener('click', function () {
        var feedback = root.querySelector('.demo-feedback');
        if (button.dataset.demoAnswer === 'wrong') {
          wrong += 1; button.classList.add('wrong'); feedback.textContent = '再看一次演示，不扣分。';
          api.speak(unitId === 'morning' ? 'get' : 'is');
          return;
        }
        root.querySelectorAll('[data-demo-answer]').forEach(function (item) { item.disabled = true; });
        button.classList.add('correct'); feedback.textContent = '挑战完成！';
        api.speak(unitId === 'morning' ? 'She gets dressed.' : 'Where are the books?');
        if (!api.earned) feedback.textContent = '挑战完成！' + (api.completed(wrong) || '');
      });
    });
    if (api.earned) root.querySelector('.demo-feedback').textContent = '这项加分挑战已经完成。';
  }

  window.TownTeaching = { render: render, bind: bind };
}());

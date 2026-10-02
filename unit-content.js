(function () {
  'use strict';
  // Original practice sentences: unit titles follow the confirmed roadmap, not unverified textbook lines.
  const groups = [
    ['1a', [
      { id: 'greetings', zh: '打招呼', icon: '👋', word: 'hello', other: ['goodbye', 'school'], build: ['I', 'am', 'your friend.'], say: 'Hello! I am your friend.', transfer: 'You are my friend.', demo: [['🦊', '我自己', 'I am a friend.', '自己介绍用 I am。'], ['🐰', '对搭档', 'You are a friend.', '对着搭档说用 You are。']], quiz: ['对着搭档说：You ___ a friend.', 'am', 'are'], extra: ['交换徽章再问：Who am I? I am your friend.', '问自己是谁，用 am；对着别人说用 are。'] },
      { id: 'new-friends', zh: '新朋友', icon: '🧑', word: 'friend', other: ['book', 'desk'], build: ['He', 'is', 'my friend.'], say: 'Who is she? She is my friend.', transfer: 'She is my friend.', demo: [['🦊', '男探员', 'He is my friend.', '指男孩说 He is。'], ['🐰', '女探员', 'She is my friend.', '指女孩说 She is。']], quiz: ['指女孩：___ is my friend.', 'He', 'She'], extra: ['揭开剪影：Who is he? He is my friend.', 'Who 寻找人物，不是在问地点。'] },
      { id: 'my-schoolbag', zh: '我的书包', icon: '🎒', word: 'bag', other: ['ball', 'sun'], build: ['This', 'is', 'my bag.'], say: 'This is my bag.', transfer: 'That is your bag.', demo: [['🎒', '拿在手里', 'This is my bag.', '物品在身边，用 This。'], ['🧳', '放到远处', 'That is my bag.', '物品在远处，用 That。']], quiz: ['指远处的书包：___ is my bag.', 'This', 'That'], extra: ['贴上姓名：This is my bag. That is your bag.', 'my 是我的，your 是你的，贴在物品名前。'] },
      { id: 'my-classroom', zh: '我的教室', icon: '🏫', word: 'sit', other: ['stand', 'run'], build: ['Sit', 'down', 'please.'], say: 'Stand up, please.', transfer: 'Open your book.', demo: [['🪑', '坐下卡', 'Sit down, please.', '动作放在开头：坐下。'], ['📖', '开书卡', 'Open your book.', '动作换成 Open，机器人就打开书。']], quiz: ['想让机器人坐下，选哪张动作卡？', 'Open', 'Sit'], extra: ['先站后坐：Stand up. Sit down.', '两个动作卡排顺序，先做第一条，再做第二条。'] },
      { id: 'lovely-faces', zh: '可爱的脸', icon: '😊', word: 'happy', other: ['sad', 'big'], build: ['She', 'is', 'happy.'], say: 'He is happy.', transfer: 'She is sad.', demo: [['😊', '笑脸', 'She is happy.', '描述现在的样子，is 后面放 happy。'], ['😢', '哭脸', 'She is sad.', '表情变了，只要换末尾的描述词。']], quiz: ['看到笑脸：She is ___.', 'sad', 'happy'], extra: ['看一张 happy face：happy 也能放在 face 前面。', '描述词可以站在 is 后，也可以站在物品名之前。'] },
      { id: 'my-family', zh: '我的家人', icon: '👨‍👩‍👧', word: 'family', other: ['friend', 'book'], build: ['She', 'is', 'my mum.'], say: 'Who is she? She is my mum.', transfer: 'They are my family.', demo: [['👩', '一人照片', 'She is my mum.', '只拍到一个人，用 She is。'], ['👨‍👩‍👧', '多人合照', 'They are my family.', '照片里有多人，用 They are。']], quiz: ['看多人合照：They ___ my family.', 'is', 'are'], extra: ['指照片：This is her bag. That is his bag.', 'her 是她的，his 是他的；放在物品名前。'] },
      { id: 'animals-in-our-lives', zh: '生活中的动物', icon: '🐱', word: 'cat', other: ['dog', 'fish'], build: ['It', 'is', 'a cat.'], say: 'It is a small cat.', transfer: 'They are cats.', demo: [['🐱', '一只', 'It is a cat.', '一只动物用 It is。'], ['🐱🐱', '两只', 'They are cats.', '两只用 They are，cat 加 s。']], quiz: ['两只猫：They ___ cats.', 'is', 'are'], extra: ['一只 big cat，旁边一只 small cat。', 'big/small 可以放在 cat 前，说清是哪种猫。'] },
      { id: 'have-a-go', zh: '试一试', icon: '🎯', word: 'jump', other: ['run', 'sit'], build: ['Jump', 'and', 'run.'], say: 'Jump, then run.', transfer: 'Run, then stop.', demo: [['⬆️', '第一站', 'Jump!', '第一张卡让角色跳。'], ['🏃', '第二站', 'Jump, then run.', '把 run 放到后面，先跳再跑。']], quiz: ['先跳再跑，第二张卡选什么？', 'stop', 'run'], extra: ['给搭档发两条指令：Jump. Stop.', '这是指令，不把 I 放在动作词前；能力句留到下一关。'] },
      { id: 'yes-i-can', zh: '我能做到', icon: '🏅', word: 'swim', other: ['jump', 'sing'], build: ['I', 'can', 'swim.'], say: 'Can you swim? Yes, I can.', transfer: 'I cannot fly.', demo: [['🏊', '我会游泳', 'I can swim.', '有这项技能，用 can 加动作原形。'], ['🦊', '他会游泳', 'He can swim.', '换成 he，can 和 swim 都不变，不说 cans。'], ['🚫', '他们不会飞', "They can't fly.", "做不到用 can't，后面仍是动作原形 fly。"], ['❓', '问她会不会', 'Can she swim? Yes, she can.', '把 can 搬到最前面提问；回答时可用 Yes, she can。']], quiz: ['不会飞：I ___ fly.', 'can', "can't"], extra: ["Can you swim? Yes, I can. / No, I can't. Can he swim? Yes, he can. / No, he can't.", "I、you、he、she、it、we、they 后面都用 can / can't；can 后直接接动作原形，不加 to，也不随 he/she 加 s。本段为原创完整拓展，待纸质句型核对。"] },
      { id: 'fun-numbers', zh: '有趣的数字', icon: '🔢', word: 'one', other: ['two', 'three'], build: ['I', 'see', 'three stars.'], say: 'How many stars? Three stars.', transfer: 'I see two stars.', demo: [['⭐', '一颗', 'I see one star.', '只有一颗，star 不加 s。'], ['⭐⭐⭐', '三颗', 'I see three stars.', '数到三，star 加 s。']], quiz: ['三颗星：three ___', 'star', 'stars'], extra: ['These are three stars. Those are two stars.', 'these 是近处这些，those 是远处那些；后面接多个。'] }
    ]],
    ['1b', [
      { id: 'back-to-school', zh: '回到学校', icon: '🎒', word: 'school', other: ['home', 'park'], build: ['Are', 'you', 'ready?'], say: 'Are you ready? Yes, I am.', transfer: 'No, I am not ready.', demo: [['💬', '陈述', 'You are ready.', '平常告诉同伴，You 站在前。'], ['❓', '提问', 'Are you ready?', '把 are 搬到最前面，就变成问题。']], quiz: ['向同伴发问：___ you ready?', 'Is', 'Are'], extra: ["Yes, I am. No, I'm not.", '听懂 I am 与缩写 I’m，先学完整答句。'] },
      { id: 'lunch-time', zh: '午餐时间', icon: '🍱', word: 'lunch', other: ['breakfast', 'dinner'], build: ["It's", 'time for', 'lunch.'], say: "It's time for lunch.", transfer: "It's time for breakfast.", demo: [['🍱', '名词票', "It's time for lunch.", '午餐是事情的名字，走 for 通道。'], ['🥐', '换票', "It's time for breakfast.", '换成早餐的名字，for 不变。']], quiz: ['午餐是事情的名字：time ___ lunch', 'to', 'for'], extra: ["It's time to eat.", 'eat 是动作，走 to 通道；与 for lunch 对比。'] },
      { id: 'colours-in-the-park', zh: '公园的颜色', icon: '🌷', word: 'red', other: ['blue', 'green'], build: ['The flower', 'is', 'red.'], say: 'I see a red flower.', transfer: 'The flower is blue.', demo: [['🌷', '说颜色', 'The flower is red.', 'red 站在 is 后面。'], ['🔴🌷', '给花上色', 'It is a red flower.', 'red 移到 flower 前面。']], quiz: ['说一朵红花：a ___ flower', 'flower red', 'red'], extra: ['What colour is the flower? It is red.', 'What colour 问颜色；What is it? 则问这是什么东西。'] },
      { id: 'in-the-playground', zh: '操场上', icon: '🛝', word: 'run', other: ['jump', 'walk'], build: ["Don't", 'run', 'here.'], say: 'Walk, please.', transfer: 'Jump here, please.', demo: [['🟢', '绿灯', 'Walk, please.', '动作开头表示可以做。'], ['🔴', '红灯', "Don't run here.", "在动作前放 Don't，表示不要做。"]], quiz: ['禁止奔跑：___ run.', 'Do', "Don't"], extra: ['先说 Stop. 再说 Walk.', '把两张指令卡排成安全的顺序。'] },
      { id: 'weather', zh: '天气', icon: '☀️', word: 'sunny', other: ['rainy', 'cloudy'], build: ['It', 'is', 'sunny.'], say: 'It is sunny today.', transfer: 'It is rainy today.', demo: [['☀️', '晴天', 'It is sunny.', '说天气，用 It is 开始。'], ['🌧️', '雨天', 'It is rainy.', '天气图换了，只换末尾的词。']], quiz: ['晴天：It ___ sunny.', 'are', 'is'], extra: ['sunny / rainy；hot / cold', '拖动温度，看看热与冷的画面怎样变化。'] },
      { id: 'clothes', zh: '衣服', icon: '👕', word: 'shirt', other: ['shoes', 'hat'], build: ['This', 'is', 'my shirt.'], say: 'These are my shoes.', transfer: 'Those are your shoes.', demo: [['👕', '近处一件', 'This is my shirt.', '近处一件：this + is。'], ['👟👟', '远处两只', 'Those are my shoes.', '远处多个：those + are。']], quiz: ['远处两只鞋：___ are my shoes.', 'That', 'Those'], extra: ['This / That + is；These / Those + are。', '近远镜头和数量开关一起动：四格分别看一看。'] },
      { id: 'after-school', zh: '放学后', icon: '⏰', word: 'play', other: ['eat', 'sleep'], build: ["It's", 'time to', 'play.'], say: "It's time to play.", transfer: "It's time for a game.", demo: [['⚽', '动作票 play', "It's time to play.", 'play 是动作，走 to 通道。'], ['🎲', '物品票 a game', "It's time for a game.", 'game 是游戏的名字，走 for 通道。']], quiz: ['动作 play：time ___ play', 'for', 'to'], extra: ["When do we play? After school.", 'When 问什么时候，钟表给出放学后的时间线索。'] },
      { id: 'traffic-safety', zh: '交通安全', icon: '🚦', word: 'stop', other: ['go', 'wait'], build: ['Stop', 'at', 'the red light.'], say: 'Stop at the red light.', transfer: "Don't run across the road.", demo: [['🔴', '红灯', 'Stop at the red light.', '红灯做 Stop 的动作。'], ['🛑', '过马路', "Don't run across the road.", "动作 run 前加 Don't，表示禁止。"]], quiz: ['禁止奔跑：___ run.', 'Do', "Don't"], extra: ['Stop. Look. Then walk.', '两条以上规则按先后走，先停再观察。'] },
      { id: 'i-see-animals', zh: '我看到动物', icon: '🦋', word: 'bird', other: ['fish', 'cat'], build: ['I', 'see', 'a bird.'], say: 'I see it.', transfer: 'I see them.', demo: [['🐦', '看一只', 'I see it.', 'I 发出看这个动作，it 在后面接住目光。'], ['🐦🐦', '看一群', 'I see them.', '看到多个，目光落在 them 上。']], quiz: ['看到一群：I see ___.', 'it', 'them'], extra: ['She sees me. I see her.', '动作前是做的人；动作后是被看到的人。'] },
      { id: 'i-like-toys', zh: '我喜欢玩具', icon: '🧸', word: 'toy', other: ['ball', 'car'], build: ['Do', 'you like', 'toys?'], say: 'Do you like toys? Yes, I do.', transfer: 'I like my toy car.', demo: [['❤️', '说喜欢', 'You like toys.', '平常说喜欢，You 在前。'], ['❓', '问搭档', 'Do you like toys?', 'Do 助手跑到最前，就能问。']], quiz: ['向搭档发问：___ you like toys?', 'Does', 'Do'], extra: ['Whose toy is it? It is her toy.', 'Whose 寻找主人，her 放在 toy 前面。'] }
    ]],
    ['2a', [
      { id: 'on-the-way', zh: '在路上', icon: '🚌', word: 'bus', other: ['bike', 'walk'], build: ['How', 'do you', 'go to school?'], say: 'I go by bus.', transfer: 'I walk to school.', demo: [['🚌', '乘公交', 'I go by bus.', '换交通工具，路线画面随之变化。'], ['❓', '问路线', 'How do you go to school?', '问怎么去，用 How，do 帮忙提问。']], quiz: ['问怎么去：___ do you go?', 'Where', 'How'], extra: ['How does she go to school? She goes by bus.', '问 he/she 时，do 会换成 does；后面的 go 保持原样。'] },
      { id: 'playing-sports', zh: '做运动', icon: '🏀', word: 'basketball', other: ['football', 'tennis'], build: ['Does', 'she play', 'basketball?'], say: 'Does she play basketball? Yes, she does.', transfer: 'Do you play basketball?', demo: [['🐰', '问你', 'Do you play basketball?', '你做运动，Do 来帮忙。'], ['🦊', '问她', 'Does she play basketball?', '问她，Do 换成 Does；play 不加 s。']], quiz: ['问她：___ she play basketball?', 'Do', 'Does'], extra: ['She plays basketball. Does she play basketball?', '陈述时 plays 带 s；问句里 does 拿走 s，play 回到原样。'] },
      { id: 'in-the-sky', zh: '天空中', icon: '☁️', word: 'cloud', other: ['bird', 'star'], build: ['What', 'is', 'that?'], say: 'What is that? It is a cloud.', transfer: 'What are those? They are clouds.', demo: [['☁️', '远处一个', 'What is that?', '望远镜看到远处一个，用 that / is。'], ['☁️☁️', '远处多个', 'What are those?', '镜头看到多个，用 those / are。']], quiz: ['远处多个：What ___ those?', 'is', 'are'], extra: ['Is that a cloud? Yes, it is.', '把 Is 放最前，问它是不是云。'] },
      { id: 'in-the-sea', zh: '海里', icon: '🐠', word: 'fish', other: ['crab', 'shell'], build: ['How many', 'fish', 'can you see?'], say: 'I can see two fish.', transfer: 'I can see one fish.', demo: [['🐠', '扫描一只', 'I can see one fish.', '数一只，回答 one。'], ['🐠🐠', '扫描两只', 'I can see two fish.', '数两只，回答 two；fish 这里不变。']], quiz: ['看见两条鱼：I see ___ fish.', 'one', 'two'], extra: ['The fish is small. It is a small fish.', 'small 可站在 is 后，也可站在 fish 前。'] },
      { id: 'seasons', zh: '四季', icon: '🍂', word: 'spring', other: ['summer', 'winter'], build: ['When', 'is', 'spring?'], say: 'When is spring? It is in March.', transfer: 'It is hot in summer.', demo: [['🌸', '春', 'It is warm in spring.', '转到春天，天气是 warm。'], ['☀️', '夏', 'It is hot in summer.', '转到夏天，天气变 hot。']], quiz: ['问什么时候：___ is spring?', 'Where', 'When'], extra: ['hot / cold，warm / cool', '转动季节盘，两个反义词在不同天气里换位置。'] },
      { id: 'yummy-fruit', zh: '美味水果', icon: '🍎', word: 'apple', other: ['banana', 'pear'], build: ['Do', 'you like', 'apples?'], say: 'Do you like apples? Yes, I do.', transfer: 'Does she like bananas?', demo: [['🐰', '问你', 'Do you like apples?', '问你喜欢吗，用 Do。'], ['🦊', '问她', 'Does she like apples?', '问她喜欢吗，用 Does；like 保持原样。']], quiz: ['问她喜欢苹果吗：___ she like apples?', 'Do', 'Does'], extra: ['I like this apple. I like these apples.', '一颗用 this，多颗用 these；说“喜欢它们”用 them。'] },
      { id: 'the-five-senses', zh: '五感', icon: '👂', word: 'hear', other: ['see', 'smell'], build: ['I', 'can hear', 'you.'], say: 'I can hear you.', transfer: 'She can see him.', demo: [['🦊➡️🐰', '我看他', 'I can see him.', 'I 在动作前做事，him 在后接住目光。'], ['🐰➡️🦊', '他看我', 'He can see me.', '方向反过来：He 做事，me 接住目光。']], quiz: ['他能看见我：He can see ___.', 'I', 'me'], extra: ['I/me, he/him, she/her, they/them', '交换角色箭头：箭头起点是动作的人，终点是被看到的人。'] },
      { id: 'this-is-me', zh: '这就是我', icon: '🪪', word: 'me', other: ['you', 'friend'], build: ['I', 'am', 'a student.'], say: 'I am a student. I like books.', transfer: 'We are friends.', demo: [['🪪', '我的档案', 'I am a student.', '介绍自己，用 I am。'], ['🤝', '搭档合照', 'We are friends.', '一起说我们，用 We are。']], quiz: ['一起介绍：We ___ friends.', 'is', 'are'], extra: ['I am / he is / she is / it is / you are / we are / they are.', '把头像逐个拖进档案框，每换一个人就听对应的 be。'] }
    ]]
  ];

  const titles = {
    greetings: 'Greetings', 'new-friends': 'New friends', 'my-schoolbag': 'My schoolbag', 'my-classroom': 'My classroom',
    'lovely-faces': 'Lovely faces', 'my-family': 'My family', 'animals-in-our-lives': 'Animals in our lives', 'have-a-go': 'Have a go!',
    'yes-i-can': 'Yes, I can!', 'fun-numbers': 'Fun numbers', 'back-to-school': 'Back to school', 'lunch-time': 'Lunch time',
    'colours-in-the-park': 'Colours in the park', 'in-the-playground': 'In the playground', weather: 'Weather', clothes: 'Clothes',
    'after-school': 'After school', 'traffic-safety': 'Traffic safety', 'i-see-animals': 'I see animals', 'i-like-toys': 'I like toys',
    'on-the-way': 'On the way', 'playing-sports': 'Playing sports', 'in-the-sky': 'In the sky', 'in-the-sea': 'In the sea',
    seasons: 'Seasons', 'yummy-fruit': 'Yummy fruit', 'the-five-senses': 'The five senses', 'this-is-me': 'This is me'
  };
  const units = {};
  groups.forEach(function ([volume, entries]) {
    entries.forEach(function (item, index) {
      const number = String((volume === '1a' ? 0 : volume === '1b' ? 10 : 22) + index + 1).padStart(2, '0');
      const tokens = item.build;
      const full = tokens.join(' ');
      const choices = [item.word].concat(item.other);
      units[item.id] = {
        id: item.id, volume, number, name: titles[item.id], zh: item.zh,
        scene: volume === '2a' ? 'assets/room.svg' : 'assets/morning.svg', icon: item.icon,
        label: 'UNIT ' + number + ' · ' + item.zh,
        intro: '城市里出现了' + item.zh + '的线索。先听角色说，再替搭档完成任务。',
        words: choices,
        grammar: {
          title: '句子密码 · ' + item.zh,
          pattern: tokens.slice(),
          note: item.demo[0][3] + ' ' + item.demo[1][3],
          extensions: item.demo.map(function (step) { return { label: step[1], english: step[2], chinese: step[3] }; }),
          tip: '点上方演示切换画面；这两句是围绕单元主题编写的原创练习。'
        },
        phonics: { letter: item.word[0].toLowerCase(), sample: item.word, title: '听一听这个词', text: '点击听 ' + item.word + '，留意开头的声音。' },
        demo: { steps: item.demo, quiz: item.quiz, extra: item.extra },
        tasks: [
          { type: 'listen', label: '第一条线索 · 听一听', title: '听到哪个线索？', prompt: '先听声音，再找对应图片。', audio: item.word, options: choices.map(function (word, i) { return { icon: i ? ['🔎', '📍'][i - 1] : item.icon, text: word, correct: i === 0 }; }) },
          { type: 'build', label: '第二条线索 · 拼一拼', title: '把角色台词拼完整', prompt: '听一遍，再按说话的顺序放卡片。', audio: full, words: tokens.slice(), answer: tokens.slice() },
          { type: 'speak', label: '第三条线索 · 说一说', title: '轮到你扮演探员', prompt: '听角色台词，再替他或她说一遍。', audio: item.say, phrase: item.say },
          { type: 'transfer', label: '最终线索 · 换一换', title: '场景变了，台词也变了', prompt: '听新的台词，找到与它相同的一句。', audio: item.transfer, options: [
            { icon: item.demo[1][0], text: item.transfer, correct: true },
            { icon: item.demo[0][0], text: item.demo[0][2] },
            { icon: '🔄', text: item.say }
          ] }
        ]
      };
    });
  });
  window.TownUnitContent = units;
}());

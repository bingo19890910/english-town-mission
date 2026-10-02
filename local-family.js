(function () {
  'use strict';
  const KEY = 'english-town-local-family-v1';
  const listeners = new Set();
  const scores = { listen: 2, build: 3, speak: 2, transfer: 4, grammar: 5 };
  const names = { listen: '听音识图', build: '拼句', speak: '角色表达', transfer: '场景迁移', grammar: '语法挑战' };
  let unlockedUntil = 0, unlockedHash = '', message = '本机保存 · 不跨设备同步';
  const now = () => new Date().toISOString();
  const id = () => crypto.randomUUID();
  function base() { return { version: 1, pinHash: '', pinSalt: '', pinFailures: 0, pinLockedUntil: 0, ledger: [], rewards: [], redemptions: [], events: [] }; }
  function child(role) {
    if (!['fox', 'rabbit'].includes(role)) throw new Error('探员档案无效。');
    return { id: role, nickname: role === 'fox' ? '阿洛' : '米米' };
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return base();
      const data = JSON.parse(raw);
      if (!data || data.version !== 1 || !['ledger', 'rewards', 'redemptions', 'events'].every(k => Array.isArray(data[k])) ||
        !data.ledger.every(x => x && ['fox', 'rabbit'].includes(x.child_id) && Number.isSafeInteger(x.amount) && x.amount !== 0 && typeof x.source_key === 'string') ||
        !data.rewards.every(x => x && typeof x.id === 'string' && typeof x.title === 'string' && ['pending_price', 'published', 'delisted', 'withdrawn'].includes(x.status)) ||
        !data.redemptions.every(x => x && typeof x.id === 'string' && ['fox', 'rabbit'].includes(x.child_id) && Number.isSafeInteger(x.points_cost) && x.points_cost > 0 && ['requested', 'fulfilled', 'rejected'].includes(x.status))) throw new Error('invalid data');
      return {
        version: 1,
        pinHash: typeof data.pinHash === 'string' ? data.pinHash : '',
        pinSalt: typeof data.pinSalt === 'string' ? data.pinSalt : '',
        pinFailures: Number.isSafeInteger(data.pinFailures) ? data.pinFailures : 0,
        pinLockedUntil: Number.isFinite(data.pinLockedUntil) ? data.pinLockedUntil : 0,
        ledger: data.ledger,
        rewards: data.rewards,
        redemptions: data.redemptions,
        events: data.events
      };
    } catch (_) { throw new Error('本机家庭记录无法读取；请不要清除浏览器数据，联系家长检查。'); }
  }
  function emit() {
    const banner = document.getElementById('cloud-status');
    if (banner) banner.textContent = message;
    listeners.forEach(fn => fn());
  }
  function report(error) { message = error.message; emit(); }
  function isParent(data) { const s = data || load(); return Boolean(unlockedUntil > Date.now() && unlockedHash && unlockedHash === s.pinHash); }
  function parent(data) { if (!isParent(data)) throw new Error('请先解锁家长管理。'); }
  // Serialize read-modify-write across tabs where Web Locks is available.
  function transaction(fn) {
    const write = () => {
      const data = load(), result = fn(data);
      try { localStorage.setItem(KEY, JSON.stringify(data)); }
      catch (_) { throw new Error('本机存储失败；记录未保存，请导出备份并检查浏览器空间。'); }
      message = '本机已保存 · 不跨设备同步'; emit();
      return result;
    };
    const operation = navigator.locks ? navigator.locks.request(KEY, write) : Promise.resolve().then(write);
    return operation.catch(error => { report(error); throw error; });
  }
  function balance(data, role) { child(role); return data.ledger.filter(x => x.child_id === role).reduce((n, x) => n + x.amount, 0); }
  function entry(data, role, amount, reason, source) {
    if (!data.ledger.some(x => x.child_id === role && x.source_key === source)) data.ledger.push({ id: id(), child_id: role, amount, reason, source_key: source, created_at: now() });
  }
  function text(value, max, required) {
    const result = String(value || '').trim();
    if (result.length > max || (required && !result)) throw new Error('请检查名称或备注长度。');
    return result;
  }
  function cost(value) { if (!Number.isSafeInteger(value) || value < 1 || value > 100000) throw new Error('积分须为 1–100000 的整数。'); return value; }
  async function pinDigest(pin, salt) {
    const bytes = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' },
      await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']), 256);
    return Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, '0')).join('');
  }
  const api = {
    child, isParent,
    state() { try { const s = load(); return { ...s, pinSet: Boolean(s.pinHash), message }; } catch (error) { return { ...base(), pinSet: false, message: error.message, error: true }; } },
    complete(role, unit, stage, wrong) {
      child(role);
      const content = window.TownUnitContent && window.TownUnitContent[unit];
      if (!(['morning', 'room'].includes(unit) || content) || !scores[stage]) return Promise.reject(new Error('学习关卡无效。'));
      return transaction(s => {
        const source = 'stage:first:' + unit + ':' + stage;
        if (s.ledger.some(x => x.child_id === role && x.source_key === source)) return false;
        s.events.push({ id: id(), child_id: role, unit_id: unit, stage_id: stage, wrong_count: Math.max(0, wrong || 0), created_at: now() });
        const unitName = unit === 'morning' ? '早晨' : unit === 'room' ? '房间' : content.zh;
        entry(s, role, scores[stage], unitName + ' · ' + names[stage], source);
        return true;
      });
    },
    submitWish(role, title, description) {
      child(role); title = text(title, 60, true); description = text(description, 240);
      return transaction(s => s.rewards.push({ id: id(), requested_by_child_id: role, audience_child_id: role, title, description, points_cost: null, status: 'pending_price', created_at: now() }));
    },
    withdraw(role, rewardId) {
      child(role);
      return transaction(s => { const r = s.rewards.find(x => x.id === rewardId && x.requested_by_child_id === role); if (!r) throw new Error('找不到这个心愿。'); r.status = 'withdrawn'; });
    },
    saveReward(input) {
      return transaction(s => {
        parent(s);
        let r = input.id && s.rewards.find(x => x.id === input.id && x.status !== 'withdrawn');
        if (input.id && !r) throw new Error('找不到这个奖品。');
        const values = Object.assign({}, r, input);
        const title = text(values.title, 60, true), description = text(values.description, 240), points = cost(values.points_cost);
        if (!['published', 'delisted'].includes(values.status)) throw new Error('奖品状态无效。');
        if (values.audience_child_id) child(values.audience_child_id);
        if (!r) { r = { id: id(), created_at: now() }; s.rewards.push(r); }
        Object.assign(r, { title, description, points_cost: points, status: values.status, audience_child_id: values.audience_child_id || null });
      });
    },
    redeem(role, rewardId, requestId) {
      child(role);
      return transaction(s => {
        if (s.redemptions.some(x => x.client_request_id === requestId && x.child_id === role)) return;
        const r = s.rewards.find(x => x.id === rewardId && x.status === 'published' && (!x.audience_child_id || x.audience_child_id === role));
        if (!r) throw new Error('这个奖品已下架或不属于当前探员。');
        const points = cost(r.points_cost);
        if (balance(s, role) < points) throw new Error('可用积分还不够，继续探索吧。');
        const red = { id: id(), client_request_id: requestId, child_id: role, reward_id: r.id, reward_title: r.title, points_cost: points, status: 'requested', requested_at: now() };
        s.redemptions.push(red); entry(s, role, -points, '申请兑换：' + r.title, 'redemption:reserve:' + red.id);
      });
    },
    resolve(redemptionId, decision) {
      return transaction(s => {
        parent(s);
        if (!['fulfilled', 'rejected'].includes(decision)) throw new Error('兑换处理无效。');
        const r = s.redemptions.find(x => x.id === redemptionId);
        if (!r) throw new Error('找不到兑换记录。');
        if (r.status !== 'requested') return;
        r.status = decision; r.resolved_at = now();
        if (decision === 'rejected') entry(s, r.child_id, r.points_cost, '退回积分：' + r.reward_title, 'redemption:refund:' + r.id);
      });
    },
    async setPin(pin) {
      if (!/^\d{4,6}$/.test(pin)) throw new Error('请输入 4–6 位数字 PIN。');
      const salt = id(), hash = await pinDigest(pin, salt);
      await transaction(s => { if (s.pinHash) parent(s); s.pinSalt = salt; s.pinHash = hash; s.pinFailures = 0; s.pinLockedUntil = 0; });
      unlockedHash = hash;
      unlockedUntil = Date.now() + 1800000;
      emit();
    },
    async unlock(pin) {
      const current = load();
      if (!current.pinHash) throw new Error('请先设置家长 PIN。');
      const hash = await pinDigest(pin, current.pinSalt);
      const error = await transaction(s => {
        if (s.pinLockedUntil > Date.now()) return 'PIN 连续输错，请 15 分钟后再试。';
        if (hash !== s.pinHash || current.pinSalt !== s.pinSalt) {
          s.pinFailures += 1;
          if (s.pinFailures >= 5) { s.pinFailures = 0; s.pinLockedUntil = Date.now() + 900000; }
          return '家长 PIN 不正确。';
        }
        s.pinFailures = 0; s.pinLockedUntil = 0;
        unlockedHash = hash; unlockedUntil = Date.now() + 1800000;
        return '';
      });
      if (error) throw new Error(error);
    },
    lock() { unlockedUntil = 0; unlockedHash = ''; emit(); },
    export(progress) {
      const s = load(); parent(s);
      const { pinHash, pinSalt, pinFailures, pinLockedUntil, ...records } = s;
      return JSON.stringify({ format: 'english-town-local-backup', version: 1, exportedAt: now(), records, progress }, null, 2);
    },
    report,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    init() {
      try { load(); } catch (error) { report(error); }
      emit();
    }
  };
  window.TownLocal = api;
  window.addEventListener('storage', event => { if (event.key === KEY || event.key === null) emit(); });
}());

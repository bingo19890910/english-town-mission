(function () {
  'use strict';
  let host = null, app = null, activeTab = 'child', busy = false, notice = '';
  const local = () => window.TownLocal;
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const labels = { pending_price: '待家长定价', published: '已上架', delisted: '已下架', requested: '等家长兑现', fulfilled: '已兑现', rejected: '已退回积分' };
  const button = (action, text, extra) => '<button type="button" class="outline-button" data-reward-action="' + action + '" ' + (extra || '') + '>' + text + '</button>';
  function field(label, name, type, placeholder, value, extra) {
    return '<label>' + label + '<input name="' + name + '" type="' + (type || 'text') + '" placeholder="' + esc(placeholder || '') + '" value="' + esc(value || '') + '" ' + (extra || '') + ' required></label>';
  }
  function card(title, body) { return '<section class="reward-panel"><h2>' + esc(title) + '</h2>' + body + '</section>'; }
  function date(value) { return value ? new Date(value).toLocaleString('zh-CN', { hour12: false }) : ''; }

  function render() {
    if (!host || !host.isConnected) return;
    const state = local().state(), profile = app.profile(), child = local().child(profile.id);
    host.innerHTML = '<div class="view-heading"><div><div class="eyebrow">WISH STATION · 心愿补给站</div><h1>' + esc(profile.name) + '的积分与心愿</h1><p class="subline">记录只保存在这台设备的当前浏览器中，两台平板互不共享。</p></div></div>' +
      '<div class="reward-tabs">' + button('tab-child', '我的积分与心愿', 'aria-pressed="' + (activeTab === 'child') + '"') + button('tab-shop', '奖励补给站', 'aria-pressed="' + (activeTab === 'shop') + '"') + button('tab-parent', '家长管理', 'aria-pressed="' + (activeTab === 'parent') + '"') + '</div>' +
      '<p class="reward-message" role="status">' + esc(notice || state.message) + '</p>' +
      (state.error ? card('本机记录暂时无法读取', '<p>为避免覆盖原记录，积分和奖励操作已暂停。请不要清除浏览器数据，可先由家长检查或备份当前浏览器资料。</p>') : activeTab === 'parent' ? parentView(state) : activeTab === 'shop' ? shopView(state, child) : childView(state, child));
    host.querySelectorAll('[data-reward-action]').forEach(element => element.addEventListener('click', () => action(element)));
    host.querySelectorAll('form[data-reward-form]').forEach(form => form.addEventListener('submit', event => { event.preventDefault(); submit(form); }));
    host.querySelectorAll('[data-reset-select]').forEach(select => select.addEventListener('change', function () {
      const button = host.querySelector('[data-reward-action="reset-unit"][data-role="' + select.dataset.resetSelect + '"]');
      if (button) button.disabled = !select.value;
    }));
    if (busy || state.error) host.querySelectorAll('button, input, select').forEach(element => { element.disabled = true; });
  }

  function childView(state, child) {
    const entries = state.ledger.filter(x => x.child_id === child.id);
    const balance = entries.reduce((sum, x) => sum + x.amount, 0);
    const pending = state.redemptions.filter(x => x.child_id === child.id && x.status === 'requested').reduce((sum, x) => sum + x.points_cost, 0);
    const wishes = state.rewards.filter(x => x.requested_by_child_id === child.id && x.status !== 'withdrawn');
    const history = entries.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const redeemed = state.redemptions.filter(x => x.child_id === child.id).sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at));
    const learningTotal = entries.filter(x => x.source_key.startsWith('stage:first:') || x.source_key.startsWith('reset:learning:')).reduce((sum, x) => sum + x.amount, 0);
    return '<div class="point-summary"><div><small>可用积分</small><strong>' + balance + '</strong></div><div><small>申请中预留</small><strong>' + pending + '</strong></div><div><small>当前学习积分</small><strong>' + learningTotal + '</strong></div></div>' +
      '<div class="reward-parent-callout"><div><strong>家长定价入口</strong><p>孩子写好心愿后，家长在这里填写积分并上架；也可以新增其他奖励。</p></div><button type="button" class="secondary-button" data-reward-action="tab-parent">家长定价与上架</button></div>' +
      card('我的心愿清单', '<form data-reward-form="wish" class="reward-form">' + field('我想兑换', 'title', 'text', '如：和爸爸妈妈一起野餐', '', 'maxlength="60"') + '<label>备注（可选）<input name="description" maxlength="240" placeholder="说说你的小心愿"></label><button class="secondary-button" type="submit">增加心愿</button></form><div class="reward-list">' + (wishes.map(w => '<div class="reward-row"><div><strong>' + esc(w.title) + '</strong><small>' + labels[w.status] + (w.points_cost ? ' · ' + w.points_cost + ' 分' : '') + '</small></div>' + button('withdraw', '删去心愿', 'data-id="' + w.id + '"') + '</div>').join('') || '<p>还没有心愿。名称由孩子填写，积分由家长确认。</p>') + '</div>') +
      card('积分记录', '<div class="reward-list">' + (history.map(x => '<div class="reward-row"><div><strong>' + esc(x.reason) + '</strong><small>' + esc(date(x.created_at)) + '</small></div><b>' + (x.amount > 0 ? '+' : '') + x.amount + '</b></div>').join('') || '<p>完成第一条线索后，这里会出现学习积分。</p>') + '</div>') +
      card('兑换记录', '<div class="reward-list">' + (redeemed.map(x => '<div class="reward-row"><div><strong>' + esc(x.reward_title) + '</strong><small>' + labels[x.status] + ' · ' + x.points_cost + ' 分 · ' + esc(date(x.requested_at)) + '</small></div></div>').join('') || '<p>申请兑换会先预留积分；家长驳回时积分自动退回。</p>') + '</div>');
  }

  function shopView(state, child) {
    const rewards = state.rewards.filter(x => x.status === 'published' && (!x.audience_child_id || x.audience_child_id === child.id));
    return card('可兑换的奖励', '<p>申请后由家长兑现。答错、重试或不录音都不会扣分。</p><div class="reward-list">' + (rewards.map(reward => '<div class="reward-row"><div><strong>' + esc(reward.title) + '</strong><small>' + esc(reward.description) + ' · ' + reward.points_cost + ' 分</small></div>' + button('redeem', '申请兑换', 'data-id="' + reward.id + '"') + '</div>').join('') || '<p>暂时还没有上架奖励，可以先在心愿清单写下愿望。</p>') + '</div>');
  }

  function resetPanel() {
    const profiles = [local().child('fox'), local().child('rabbit')];
    const catalog = app.units();
    return '<p class="reset-warning">这里会清除所选孩子的学习关卡记录，并扣除这些单元已经领取的首次学习积分。积分、心愿、奖励和兑换历史不会删除；操作前会再次确认。</p><div class="reset-children">' + profiles.map(function (profile) {
      const progress = app.progress(profile.id) || {};
      const completed = new Set(progress.completed || []);
      const ids = catalog.map(function (unit) { return unit.id; });
      const preview = local().resetPreview(profile.id, ids).reduce(function (map, item) { map[item.unit] = item.points; return map; }, {});
      const count = ids.filter(function (id) { return completed.has(id); }).length;
      const points = ids.reduce(function (sum, id) { return sum + (preview[id] || 0); }, 0);
      const hasLearning = count > 0 || Object.keys(progress.stages || {}).some(function (id) { return (progress.stages[id] || []).length > 0; });
      const options = catalog.map(function (unit) { return '<option value="' + esc(unit.id) + '">' + esc(String(unit.number).padStart(2, '0')) + ' · ' + esc(unit.name) + (completed.has(unit.id) ? ' · 已完成' : '') + (preview[unit.id] ? ' · ' + preview[unit.id] + '分' : '') + '</option>'; }).join('');
      return '<div class="reset-child"><div class="reset-child-heading"><strong>' + esc(profile.nickname) + '</strong><span>已完成 ' + count + ' / ' + catalog.length + ' · 可扣 ' + points + ' 分</span></div><div class="reset-controls"><select data-reset-select="' + profile.id + '"><option value="">选择一个单元…</option>' + options + '</select><button type="button" class="outline-button reset-danger-button" data-reward-action="reset-unit" data-role="' + profile.id + '" disabled>重置本单元</button><button type="button" class="outline-button reset-danger-button" data-reward-action="reset-all" data-role="' + profile.id + '"' + (hasLearning ? '' : ' disabled') + '>重置全部进度</button></div></div>';
    }).join('') + '</div>';
  }

  function parentView(state) {
    const device = card('本机家庭记录', '<p>当前设备独立保存，不登录、不上传，也不与另一台平板合并。清除网站数据或更换浏览器会丢失记录，建议定期导出备份。</p>');
    if (!state.pinSet) return device + card('设置家长管理 PIN', '<p>PIN 只用于防止孩子误改奖励，不是云端账号密码。首次设置成功后会直接进入管理区。</p><form data-reward-form="pin" class="reward-form">' + field('4-6 位数字', 'pin', 'password', '', '', 'pattern="[0-9]{4,6}" inputmode="numeric"') + '<button class="secondary-button">设置并进入管理</button></form>');
    if (!local().isParent(state)) return device + card('解锁家长管理', '<form data-reward-form="unlock" class="reward-form">' + field('家长 PIN', 'pin', 'password', '', '', 'pattern="[0-9]{4,6}" inputmode="numeric"') + '<button class="secondary-button">解锁</button></form>');
    const options = '<option value="">两个孩子都可见</option><option value="fox">阿洛</option><option value="rabbit">米米</option>';
    const pendingWishes = state.rewards.filter(r => r.status === 'pending_price');
    const managedRewards = state.rewards.filter(r => r.status === 'published' || r.status === 'delisted');
    const editForm = (r, pending) => '<form data-reward-form="edit-reward" data-id="' + r.id + '" class="reward-edit ' + (pending ? 'pending' : '') + '"><div class="reward-edit-copy"><strong>' + esc(r.title) + '</strong><small>' + (r.requested_by_child_id ? esc(local().child(r.requested_by_child_id).nickname) + '的心愿' : '家长奖励') + (r.description ? ' · ' + esc(r.description) : '') + '</small></div><label>需要积分<input name="points" type="number" min="1" max="100000" step="1" value="' + (r.points_cost || '') + '" placeholder="请输入积分" required></label><button class="secondary-button">' + (pending ? '确认定价并上架' : '保存定价并上架') + '</button>' + (!pending && r.points_cost ? button(r.status === 'published' ? 'delist' : 'publish', r.status === 'published' ? '下架' : '重新上架', 'data-id="' + r.id + '"') : '') + '</form>';
    return device + card('家长操作', '<div class="reward-tabs">' + button('export', '导出本机备份') + button('lock', '锁定管理') + '</div><p>备份包含学习进度、积分、心愿和兑换，不含家长 PIN，也不含录音。</p>') +
      card('学习进度重置', resetPanel()) +
      card('待定价心愿', '<p>填写需要的积分，确认后会立即出现在孩子的“奖励补给站”。</p><div class="reward-list">' + (pendingWishes.map(r => editForm(r, true)).join('') || '<p class="reward-empty-success">目前没有等待定价的心愿。</p>') + '</div>') +
      card('家长新增奖励并上架', '<p>可以给两个孩子共同使用，也可以只给其中一个孩子。</p><form data-reward-form="reward" class="reward-form">' + field('奖励或活动名称', 'title', 'text', '如：周末亲子电影', '', 'maxlength="60"') + field('兑换积分', 'points', 'number', '如：30', '', 'min="1" max="100000" step="1"') + '<label>备注（可选）<input name="description" maxlength="240" placeholder="如：周末兑现"></label><label>谁可以兑换<select name="audience">' + options + '</select></label><button class="secondary-button">确认并上架奖励</button></form>') +
      card('已上架与已下架奖励', '<div class="reward-list">' + (managedRewards.map(r => editForm(r, false)).join('') || '<p>还没有已定价的奖励。</p>') + '</div>') +
      card('等待兑现的申请', '<div class="reward-list">' + (state.redemptions.filter(x => x.status === 'requested').map(x => '<div class="reward-row"><div><strong>' + esc(x.reward_title) + '</strong><small>' + esc(local().child(x.child_id).nickname) + ' · 已预留 ' + x.points_cost + ' 分</small></div><div class="reward-tabs">' + button('fulfilled', '已兑现', 'data-id="' + x.id + '"') + button('rejected', '驳回并退分', 'data-id="' + x.id + '"') + '</div></div>').join('') || '<p>暂时没有等待兑现的申请。</p>') + '</div>');
  }

  async function run(work, success) {
    if (busy) return;
    busy = true; notice = '正在保存，请稍候…';
    host.querySelectorAll('button, input, select').forEach(element => { element.disabled = true; });
    try { const result = await work(); notice = result || success || '已保存到本机。'; }
    catch (error) { notice = error.message || '保存失败，请重试。'; }
    finally { busy = false; render(); }
  }

  async function action(element) {
    const name = element.dataset.rewardAction;
    if (name.startsWith('tab-')) { activeTab = name.slice(4); notice = ''; render(); return; }
    if (name === 'reset-unit' || name === 'reset-all') {
      const role = element.dataset.role;
      const profile = local().child(role);
      const select = host.querySelector('[data-reset-select="' + role + '"]');
      const ids = name === 'reset-all' ? app.units().map(function (unit) { return unit.id; }) : (select && select.value ? [select.value] : []);
      if (!ids.length) return;
      const selected = name === 'reset-all' ? '全部 30 个单元' : ((app.units().find(function (unit) { return unit.id === ids[0]; }) || {}).name || '这个单元');
      if (!window.confirm('确定要重置' + profile.nickname + '的' + selected + '吗？\n学习进度会清除，并扣除对应的首次积分；这个操作不能自动恢复。')) return;
      await run(async function () {
        const result = await app.resetProgress(role, ids);
        return '已重置' + profile.nickname + '的学习进度，扣除 ' + result.total + ' 分。';
      });
      return;
    }
    await run(async () => {
      const recordId = element.dataset.id, child = local().child(app.profile().id), state = local().state();
      if (name === 'lock') local().lock();
      else if (name === 'withdraw') await local().withdraw(child.id, recordId);
      else if (name === 'redeem') {
        const key = 'english-town-redeem:' + child.id + ':' + recordId;
        let requestId = sessionStorage.getItem(key);
        if (!requestId) { requestId = crypto.randomUUID(); sessionStorage.setItem(key, requestId); }
        await local().redeem(child.id, recordId, requestId); sessionStorage.removeItem(key);
      } else if (name === 'fulfilled' || name === 'rejected') await local().resolve(recordId, name);
      else if (name === 'delist' || name === 'publish') {
        const reward = state.rewards.find(x => x.id === recordId);
        await local().saveReward({ ...reward, status: name === 'publish' ? 'published' : 'delisted' });
      } else if (name === 'export') {
        const blob = new Blob([local().export(app.backup())], { type: 'application/json' });
        const url = URL.createObjectURL(blob), anchor = document.createElement('a');
        anchor.href = url; anchor.download = 'english-town-local-' + new Date().toISOString().slice(0, 10) + '.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }, name === 'lock' ? '家长管理已锁定。' : name === 'export' ? '本机备份已导出。' : '已保存到本机。');
  }

  async function submit(form) {
    if (!form.reportValidity()) return;
    const data = new FormData(form), name = form.dataset.rewardForm, value = key => String(data.get(key) || '').trim();
    await run(async () => {
      if (name === 'pin') await local().setPin(value('pin'));
      else if (name === 'unlock') await local().unlock(value('pin'));
      else if (name === 'wish') await local().submitWish(app.profile().id, value('title'), value('description'));
      else if (name === 'reward') await local().saveReward({ title: value('title'), description: value('description'), points_cost: Number(value('points')), audience_child_id: value('audience') || null, status: 'published' });
      else if (name === 'edit-reward') {
        const reward = local().state().rewards.find(x => x.id === form.dataset.id);
        await local().saveReward({ ...reward, points_cost: Number(value('points')), status: 'published' });
      }
    }, name === 'pin' ? 'PIN 已设置，已进入家长管理。' : name === 'unlock' ? '家长管理已解锁。' : name === 'reward' ? '家长奖励已定价并上架。' : name === 'edit-reward' ? '心愿或奖励已定价并上架。' : '已保存到本机。');
  }

  local().subscribe(() => {
    const focused = host && host.contains(document.activeElement) && /^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (host && host.isConnected && !busy && !focused) render();
  });
  window.TownRewards = {
    mount(element, appApi) { host = element; app = appApi; activeTab = 'child'; notice = ''; render(); },
    unmount() { host = null; },
    parent() { activeTab = 'parent'; render(); }
  };
}());

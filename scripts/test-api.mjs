/** 后端 API 集成测试：登录/鉴权/进度读写/静态托管/重启持久化（重启由外部脚本控制） */
const BASE = 'http://localhost:3000';
let pass = 0;
let fail = 0;
function check(name, ok, detail = '') {
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}

const r = async (path, opts = {}) => {
  const res = await fetch(BASE + path, opts);
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  return { status: res.status, data, contentType: res.headers.get('content-type') || '' };
};

// 1. 错误密码
let res = await r('/api/login', { method: 'POST', body: JSON.stringify({ username: 'admin', password: 'wrong' }) });
check('错误密码返回 401', res.status === 401 && !!res.data.error);

// 2. 正确登录
res = await r('/api/login', { method: 'POST', body: JSON.stringify({ username: 'admin', password: 'admin@123' }) });
check('admin/admin@123 登录成功', res.status === 200 && !!res.data?.token && res.data.username === 'admin');
const token = res.data?.token;

// 3. 无 token 访问受保护接口
res = await r('/api/progress');
check('无 token 访问进度返回 401', res.status === 401);

// 4. 伪造 token
res = await r('/api/progress', { headers: { Authorization: 'Bearer ' + 'f'.repeat(64) } });
check('伪造 token 返回 401', res.status === 401);

// 5. 写进度
const progress = { settings: { name: '小明', examDate: '2026-10-17' }, readLessons: ['pol-01', 'pol-02'], attempts: { 'pol-o001': { qid: 'pol-o001', correct: false, lastAt: 1, wrongCount: 1, correctCount: 0 } }, exams: [], planDone: { w1d0t0: true } };
res = await r('/api/progress', { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ progress }) });
check('写入进度', res.status === 200 && res.data?.ok);

// 6. 读进度
res = await r('/api/progress', { headers: { Authorization: `Bearer ${token}` } });
check('读回进度一致', res.status === 200 && res.data?.progress?.settings?.name === '小明' && res.data?.progress?.readLessons?.length === 2, `name=${res.data?.progress?.settings?.name}`);

// 7. 会话校验
res = await r('/api/session', { headers: { Authorization: `Bearer ${token}` } });
check('会话校验返回用户名', res.status === 200 && res.data?.username === 'admin');

// 8. 静态托管
res = await fetch(BASE + '/');
const html = await res.text();
check('首页 HTML 托管', res.status === 200 && html.includes('<div id="root">'));
res = await fetch(BASE + '/assets', { redirect: 'manual' });
check('SPA 回退（/assets → index.html）', (await fetch(BASE + '/assets/nonexist.js')).status === 200);

// 9. API 404
res = await r('/api/nothing', { headers: { Authorization: `Bearer ${token}` } });
check('未知 API 返回 404', res.status === 404);

// 10. 退出登录后 token 失效
await r('/api/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
res = await r('/api/progress', { headers: { Authorization: `Bearer ${token}` } });
check('登出后 token 失效', res.status === 401);

console.log(`\n==== API 测试：${pass}/${pass + fail} 通过 ====`);
process.exit(fail ? 1 : 0);

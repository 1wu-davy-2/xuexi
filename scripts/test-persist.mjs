/** 重启持久化验证：重启后登录读取进度，应存在且结构完整（具体内容随测试演变，只验存在性） */
const BASE = 'http://localhost:3000';
const res = await fetch(BASE + '/api/login', {
  method: 'POST',
  body: JSON.stringify({ username: 'admin', password: 'admin@123' }),
});
const { token } = await res.json();
const res2 = await fetch(BASE + '/api/progress', { headers: { Authorization: 'Bearer ' + token } });
const data = await res2.json();
const p = data.progress;
const ok = !!p && typeof p === 'object' && !!p.settings && Array.isArray(p.readLessons) && p.attempts && typeof p.attempts === 'object';
console.log('RESTART-PERSIST:', ok ? 'OK - \u8fdb\u5ea6\u6570\u636e\u5728\u91cd\u542f\u540e\u5b8c\u6574\u4fdd\u7559 (name=' + (p.settings.name || '-') + ', attempts=' + Object.keys(p.attempts).length + ')' : 'LOST!');
process.exit(ok ? 0 : 1);

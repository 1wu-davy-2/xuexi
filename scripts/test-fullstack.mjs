/** 全栈 UI 测试（http://localhost:3000）：登录页 → 错误提示 → 登录 → 应用可用 → 云同步闭环 → 刷新保持会话 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const BASE = 'http://localhost:3000';
const exe = ['C:/Users/ww/AppData/Local/Google/Chrome/Application/chrome.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p));
fs.mkdirSync('e2e-out', { recursive: true });

const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 1000 } });
const page = await browser.newPage();
page.on('dialog', (d) => void d.dismiss()); // 原生 alert 自动关闭，避免阻塞
const errs = [];
page.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}
const text = () => page.evaluate(() => document.body.innerText);
async function clickBtn(t, { exact = false } = {}) {
  for (const h of await page.$$('button')) {
    const x = (await h.evaluate((el) => el.textContent)) || '';
    if (exact ? x.trim() === t : x.includes(t)) { await h.click(); return true; }
  }
  return false;
}
async function fillInput(selector, value) {
  await page.evaluate(
    (s, v) => {
      const el = document.querySelector(s);
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    },
    selector, value,
  );
}

try {
  // 1. 未登录 → 登录页
  await page.goto(BASE + '/#/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1200));
  let t = await text();
  check('未登录显示登录页', t.includes('成考冲刺') && t.includes('用户名') && t.includes('登录'));

  // 2. 错误密码
  await fillInput('input[placeholder="用户名"]', 'admin');
  await fillInput('input[placeholder="密码"]', 'wrong-pass');
  await clickBtn('登录', { exact: true });
  await new Promise((r) => setTimeout(r, 800));
  t = await text();
  check('错误密码提示', t.includes('用户名或密码错误'));

  // 3. 正确登录
  await fillInput('input[placeholder="密码"]', 'admin@123');
  await clickBtn('登录', { exact: true });
  await new Promise((r) => setTimeout(r, 1600));
  t = await text();
  check('登录后进入应用', t.includes('距离江苏成考还有'), '');
  check('侧栏显示用户名 admin', t.includes('admin'));

  // 4. 改设置姓名 → 触发云同步
  await page.goto(BASE + '/#/settings', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 900));
  await fillInput('input[placeholder*="页眉"]', '小李');
  await clickBtn('保存设置');
  await new Promise((r) => setTimeout(r, 1600));
  t = await text();
  check('设置页显示云同步状态', t.includes('云端同步'), '');
  check('同步完成', t.includes('已同步') || t.includes('同步中'));

  // 5. 服务端确认收到
  const apiCheck = await page.evaluate(async () => {
    const token = localStorage.getItem('ckxuexi.v1.token');
    const res = await fetch('/api/progress', { headers: { Authorization: 'Bearer ' + token } });
    const data = await res.json();
    return data?.progress?.settings?.name;
  });
  check('服务器已收到同步数据', apiCheck === '小李', `server name=${apiCheck}`);

  // 6. 刷新后保持登录 + 数据来自云端（URL 仍在 #/settings；输入框的值不在 innerText 里，需单独读取）
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1800));
  t = await text();
  const nameVal = await page.evaluate(() => document.querySelector('input[placeholder*="页眉"]')?.value);
  check('刷新后仍登录且进入应用', t.includes('账号与数据同步') && nameVal === '小李', `nameVal=${nameVal}`);

  // 7. 登出 → 回登录页
  await page.goto(BASE + '/#/settings', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 900));
  await clickBtn('退出登录');
  await new Promise((r) => setTimeout(r, 1000));
  t = await text();
  check('登出回到登录页', t.includes('用户名') && t.includes('密码'));

  const realErrs = errs.filter((e) => !e.includes('Failed to load resource')); // 预期内的 4xx 资源日志（如错误密码 401）不算异常
  check('全程无未捕获异常', realErrs.length === 0, realErrs.slice(0, 2).join(' | '));
} catch (e) {
  check('测试执行中断', false, String(e).slice(0, 300));
  await page.screenshot({ path: 'e2e-out/fullstack-fail.png' }).catch(() => {});
}

await page.screenshot({ path: 'e2e-out/fullstack.png' }).catch(() => {});
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n==== 全栈 UI 测试：${results.length - failed.length}/${results.length} 通过 ====`);
process.exit(failed.length ? 1 : 0);

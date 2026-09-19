/**
 * E2E 冒烟测试：使用系统 Chrome（headless）驱动复习系统。
 * 运行：node scripts/e2e.mjs   （需先启动 npm run dev，端口 5266）
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5266';
const CHROME_CANDIDATES = [
  'C:/Users/ww/AppData/Local/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];
const exe = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!exe) throw new Error('未找到 Chrome');

const OUT = path.resolve('e2e-out');
fs.mkdirSync(OUT, { recursive: true });

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900'],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + String(e).slice(0, 300)));

// 点击包含指定文本的按钮
async function clickBtn(text, { exact = false, index = 0 } = {}) {
  const handles = await page.$$('button');
  const hits = [];
  for (const h of handles) {
    const t = (await h.evaluate((el) => el.textContent)) || '';
    if (exact ? t.trim() === text : t.includes(text)) hits.push(h);
  }
  if (!hits.length) throw new Error('button not found: ' + text);
  if (index >= hits.length) throw new Error(`button index ${index} of ${hits.length}: ` + text);
  await hits[index].click();
  return hits.length;
}

async function text() {
  return page.evaluate(() => document.body.innerText);
}

try {
  // 0. 若出现登录页（后端可达），自动登录；否则应用会进入本地模式
  await page.goto(BASE + '/#/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1000));
  let t0 = await text();
  if (t0.includes('默认账号')) {
    for (let attempt = 0; attempt < 2; attempt++) {
      await page.evaluate(() => {
        const setV = (sel, v) => {
          const el = document.querySelector(sel);
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, v);
          el.dispatchEvent(new Event('input', { bubbles: true }));
        };
        setV('input[placeholder="用户名"]', 'admin');
        setV('input[placeholder="密码"]', 'admin@123');
        const b = [...document.querySelectorAll('button')].find((x) => (x.textContent || '').trim() === '登录');
        if (b) b.click();
      });
      await new Promise((r) => setTimeout(r, 2000));
      t0 = await text();
      if (t0.includes('距离江苏成考还有')) break;
    }
    check('自动登录（后端模式）', t0.includes('距离江苏成考还有'));
  }

  // 1. 首页
  await page.waitForSelector('main', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 1200));
  let t = await text();
  check('首页渲染：倒计时', /距离江苏成考还有\s*\d+\s*天/.test(t.replace(/\s+/g, '')));
  check('首页渲染：三科卡片', t.includes('政治') && t.includes('英语') && t.includes('高等数学（一）'));

  // 2. 专项练习：答题→判分→解析
  await page.goto(BASE + '/#/practice/politics', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1000));
  t = await text();
  const mBank = t.match(/题库共 (\d+) 题/);
  check('练习配置页读取题库', !!mBank, mBank && mBank[0]);
  await clickBtn('开始练习');
  await new Promise((r) => setTimeout(r, 900));
  // 选第一个选项并提交
  await clickBtn('A', { exact: false, index: 1 }).catch(() => {});
  // 选项按钮 textContent 形如 "A物质和运动的关系问题"，用更稳的方式：点第 2 个选项按钮（index 跳过头部）
  const optBtns = await page.$$('button');
  let clicked = false;
  for (const h of optBtns) {
    const t2 = (await h.evaluate((el) => el.textContent)) || '';
    if (/^A[^A-Za-z]/.test(t2) && t2.length > 2) {
      await h.click();
      clicked = true;
      break;
    }
  }
  check('练习：选中选项', clicked);
  await new Promise((r) => setTimeout(r, 300));
  await clickBtn('提交答案', { exact: true });
  await new Promise((r) => setTimeout(r, 700));
  t = await text();
  check('练习：判分反馈出现', t.includes('回答正确') || t.includes('回答错误'));
  check('练习：解析出现', t.includes('解析'));

  // 3. 模拟考试完整流程
  await page.goto(BASE + '/#/exam', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 900));
  await clickBtn('开始 政治 模考');
  await new Promise((r) => setTimeout(r, 1100));
  t = await text();
  const mm = t.match(/已答 (\d+)\/(\d+)/);
  check('模考：组卷成功', !!mm, mm && mm[0]);
  const totalQ = mm ? Number(mm[2]) : 0;
  // 答前 3 道选择题：选 A
  for (let i = 0; i < 3 && i < totalQ; i++) {
    const btns = await page.$$('button');
    for (const h of btns) {
      const t2 = (await h.evaluate((el) => el.textContent)) || '';
      if (/^A[^A-Za-z]/.test(t2) && t2.length > 2) { await h.click(); break; }
    }
    await new Promise((r) => setTimeout(r, 200));
    if (i < 2) {
      await clickBtn('下一题', { exact: true }).catch(() => {});
      await new Promise((r) => setTimeout(r, 350));
    }
  }
  await clickBtn('交卷', { exact: true });
  await new Promise((r) => setTimeout(r, 900));
  t = await text();
  check('模考：进入主观题自评', t.includes('主观题自评'), '');
  // 全部自评为「没答上」，计数到 6/6 后点完成自评
  let finalized = false;
  for (let guard = 0; guard < 40; guard++) {
    t = await text();
    if (t.includes('各部分情况') || t.includes('逐题回顾')) { finalized = true; break; }
    const cm = t.match(/（(\d+)\/6）/);
    if (cm && cm[1] === '6') {
      await clickBtn('完成自评').catch(() => {});
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }
    await clickBtn('没答上').catch(() => {});
    await new Promise((r) => setTimeout(r, 500));
  }
  check('模考：自评全部完成并出成绩', finalized, '');
  await new Promise((r) => setTimeout(r, 600));
  t = await text();
  const scoreM = t.match(/满分 (\d+)/);
  check('模考：出成绩页', t.includes('逐题回顾') || t.includes('各部分情况'), scoreM && scoreM[0]);
  check('模考：满分应为 150', scoreM && scoreM[1] === '150', scoreM && scoreM[0]);
  await page.screenshot({ path: path.join(OUT, 'exam-result.png') });

  // 4. 错题本（模考错题自动入本）
  await page.goto(BASE + '/#/wrong', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1000));
  t = await text();
  const wrongM = t.match(/累计错题\s*(\d+)/);
  check('错题本：模考错题入账', !!wrongM && Number(wrongM[1]) > 0, wrongM && wrongM[0]);

  // 5. 错题本导出 PDF（真实下载）
  const client = await page.target().createCDPSession();
  await client.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: OUT });
  await clickBtn('导出 PDF');
  let pdfOk = false;
  let pdfFile = '';
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 500));
    const files = fs.readdirSync(OUT).filter((f) => f.endsWith('.pdf') && !f.endsWith('.crdownload'));
    if (files.length) { pdfOk = true; pdfFile = files[0]; break; }
  }
  check('错题本：导出 PDF 下载成功', pdfOk, pdfFile);
  if (pdfOk) {
    const buf = fs.readFileSync(path.join(OUT, pdfFile));
    check('PDF 文件有效性（%PDF 头 + 大小>20KB）', buf.slice(0, 4).toString() === '%PDF' && buf.length > 20000, `${buf.length} bytes`);
  }

  // 6. 打印样式验证（page.pdf 走 @media print）
  await page.goto(BASE + '/#/wrong', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  // 先点打印按钮让 print-root 挂载内容，再取消打印对话框不太可行；直接注入验证：
  // 用 emulateMediaType('print') + 检查 CSS 规则
  await page.emulateMediaType('print');
  const printCss = await page.evaluate(() => {
    const rules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const r of sheet.cssRules) if (r.media && /print/.test(r.media.mediaText)) rules.push(r.cssRules.length);
      } catch { /* 跨域样式跳过 */ }
    }
    return rules;
  });
  check('打印样式：@media print 规则存在', printCss.length > 0, JSON.stringify(printCss));
  await page.emulateMediaType('screen');

  // 7. 英语：组卷 + 共享原文展示
  await page.goto(BASE + '/#/exam', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 900));
  await clickBtn('开始 英语 模考');
  await new Promise((r) => setTimeout(r, 1100));
  t = await text();
  const em = t.match(/已答 \d+\/(\d+)/);
  check('英语模考：组卷题量合理（≥45）', !!em && Number(em[1]) >= 45, em && em[0]);

  // 7b. 高数：组卷应为 18 题（12 选择+3 填空+3 解答）
  await page.goto(BASE + '/#/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 600));
  await page.goto(BASE + '/#/exam', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 900));
  await clickBtn('开始 高等数学（一） 模考');
  await new Promise((r) => setTimeout(r, 1100));
  t = await text();
  const mm2 = t.match(/已答 \d+\/(\d+)/);
  check('高数模考：组卷 18 题', !!mm2 && Number(mm2[1]) === 18, mm2 && mm2[0]);
  const katexExam = await page.evaluate(() => document.querySelectorAll('.katex').length);
  check('高数模考：公式渲染', katexExam > 0, String(katexExam));

  // 7c. 英语：共享原文展示
  await page.goto(BASE + '/#/practice/english', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 900));
  await clickBtn('开始练习');
  await new Promise((r) => setTimeout(r, 700));
  let sawPassage = false;
  for (let i = 0; i < 18; i++) {
    t = await text();
    if (t.includes('完形原文') || t.includes('阅读原文')) { sawPassage = true; break; }
    const ok = await clickBtn('下一题', { exact: true }).then(() => true).catch(() => false);
    if (!ok) break;
    await new Promise((r) => setTimeout(r, 420));
  }
  check('英语：完形/阅读原文正常展示', sawPassage);

  // 8. 其余页面渲染冒烟
  for (const [route, expect] of [
    ['/#/plan', '冲刺计划'],
    ['/#/learn', '课程学习'],
    ['/#/learn/politics', '讲义目录'],
    ['/#/cards', '速记卡'],
    ['/#/guide', '江苏考情'],
    ['/#/strategy', '抢分策略'],
    ['/#/settings', '设置'],
    ['/#/exam', '模拟考试'],
  ]) {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 800));
    t = await text();
    check(`页面渲染 ${route}`, t.includes(expect));
  }

  // 8. 控制台错误
  check('无控制台错误', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));
} catch (e) {
  check('测试执行中断', false, String(e).slice(0, 400));
  await page.screenshot({ path: path.join(OUT, 'failure.png') }).catch(() => {});
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n==== 结果：${results.length - failed.length}/${results.length} 通过 ====`);
process.exit(failed.length ? 1 : 0);

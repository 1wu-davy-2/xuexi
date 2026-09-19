/**
 * 深度交互回归测试（第二轮）：
 * 1) 在 pol-01 讲义页复现用户报告的 TypeError
 * 2) 全页面遍历 + 三科练习/模考/错题/速记卡/计划/设置 交互
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const BASE = 'http://localhost:18888';
const exe = ['C:/Users/ww/AppData/Local/Google/Chrome/Application/chrome.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p));
const OUT = 'e2e-out';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 1000 } });
const page = await browser.newPage();

const pageErrors = [];
const consoleErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 300)));
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}
async function text() {
  return page.evaluate(() => document.body.innerText);
}
async function clickBtn(t, { exact = false } = {}) {
  const handles = await page.$$('button');
  for (const h of handles) {
    const x = (await h.evaluate((el) => el.textContent)) || '';
    if (exact ? x.trim() === t : x.includes(t)) { await h.click(); return true; }
  }
  return false;
}

try {
  let t = '';
  // ===== 1. 复现用户报错的页面：pol-01 讲义 =====
  await page.goto(BASE + '/#/lesson/politics/pol-01', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1500));
  check('讲义 pol-01 打开', (await text()).includes('哲学基本问题'));
  // 用户路径：滚到底部 → 勾"学完了"（触发自动跳下一课）
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 600));
  await clickBtn('学完了，标记并下一课');
  await new Promise((r) => setTimeout(r, 1200));
  const t2 = await text();
  check('标记学完自动跳下一课', t2.includes('第 2 讲') || t2.includes('物质与意识'));
  // 连续翻 3 课
  for (let i = 0; i < 3; i++) {
    await clickBtn('下一课').catch(() => {});
    await clickBtn('学完了，标记并下一课').catch(() => {});
    await new Promise((r) => setTimeout(r, 900));
  }
  check('连续学习翻课无错', pageErrors.length === 0, pageErrors[0]);

  // ===== 2. 高数课件（LaTeX 重页面）=====
  await page.goto(BASE + '/#/lesson/math/math-l18', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1300));
  const katex = await page.evaluate(() => document.querySelectorAll('.katex').length);
  check('高数公式手册页公式渲染', katex > 10, String(katex));

  // ===== 3. 三科练习各来一轮 =====
  for (const [sid, name] of [['politics', '政治'], ['english', '英语'], ['math', '高数']]) {
    await page.goto(`${BASE}/#/practice/${sid}`, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 900));
    await clickBtn('开始练习');
    await new Promise((r) => setTimeout(r, 800));
    // 答前 3 题：单选点 B、填空随便填、主观题走自评
    for (let i = 0; i < 3; i++) {
      let t = await text();
      if (t.includes('查看参考答案并自评')) {
        await clickBtn('做完了，查看参考答案并自评');
        await new Promise((r) => setTimeout(r, 400));
        await clickBtn('基本答对');
        await new Promise((r) => setTimeout(r, 400));
      } else if (t.includes('提交')) {
        await page.evaluate(() => {
          const spans = [...document.querySelectorAll('button span')];
          const s = spans.find((x) => x.textContent === 'B' && x.querySelector('svg') === null);
          const btn = s && s.closest('button');
          if (btn && !btn.disabled) btn.click();
        });
        await new Promise((r) => setTimeout(r, 250));
        await clickBtn('提交答案', { exact: true });
        await new Promise((r) => setTimeout(r, 400));
      }
      await clickBtn('下一题', { exact: true }).catch(() => {});
      await new Promise((r) => setTimeout(r, 350));
    }
    t = await text();
    check(`${name}练习：答题推进正常`, /本轮已答 \d+/.test(t), (t.match(/本轮已答 \d+ · 正确率 \d+%/ ) || [''])[0]);
  }

  // ===== 4. 数学模考组卷并交卷 =====
  await page.goto(BASE + '/#/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 600));
  await page.goto(BASE + '/#/exam', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 900));
  await clickBtn('开始 高等数学（一） 模考');
  await new Promise((r) => setTimeout(r, 1000));
  t = await text();
  check('高数模考 18 题组卷', /已答 \d+\/18/.test(t));
  // 答两题再交卷，走完自评
  for (let i = 0; i < 2; i++) {
    await page.evaluate(() => {
      const spans = [...document.querySelectorAll('button span')];
      const s = spans.find((x) => x.textContent === 'A' && x.querySelector('svg') === null);
      const btn = s && s.closest('button');
      if (btn && !btn.disabled) btn.click();
    });
    await new Promise((r) => setTimeout(r, 200));
    await clickBtn('下一题', { exact: true }).catch(() => {});
    await new Promise((r) => setTimeout(r, 300));
  }
  await clickBtn('交卷', { exact: true });
  await new Promise((r) => setTimeout(r, 900));
  t = await text();
  check('高数模考进入自评（含解答题）', t.includes('主观题自评'));
  // 全部自评后交卷出成绩
  for (let guard = 0; guard < 12; guard++) {
    t = await text();
    if (t.includes('各部分情况') || t.includes('逐题回顾')) break;
    const cm = t.match(/（(\d+)\/(\d+)）/);
    if (cm && cm[1] === cm[2]) {
      await clickBtn('完成自评').catch(() => {});
      await new Promise((r) => setTimeout(r, 900));
      continue;
    }
    await clickBtn('没答上').catch(() => {});
    await new Promise((r) => setTimeout(r, 450));
  }
  t = await text();
  check('高数模考完成自评出成绩', t.includes('各部分情况') || t.includes('逐题回顾'));
  // ===== 5. 错题本：模考错题入账 + 重做模式 + 掌握标记 =====
  await page.goto(BASE + '/#/wrong', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 900));
  t = await text();
  const wm = t.match(/累计错题\s*(\d+)/) || t.match(/(\d+)\s*\n累计错题/);
  check('错题本有记录（模考+练习错题）', !!wm && Number(wm[1]) > 0, wm && wm[0]);
  const masteredBefore = (t.match(/(\d+)\s*\n\s*已掌握毕业/) || ['0', '0'])[1];

  await clickBtn('标记为已掌握');
  await new Promise((r) => setTimeout(r, 500));
  t = await text();
  const masteredAfter = (t.match(/(\d+)\s*\n\s*已掌握毕业/) || ['0', '0'])[1];
  check('错题本掌握标记生效', Number(masteredAfter) === Number(masteredBefore) + 1, `${masteredBefore} -> ${masteredAfter}`);
  const redoBtn = (await page.$$('button')).find(async (h) => {});
  let foundRedo = false;
  for (const h of await page.$$('button')) {
    const x = (await h.evaluate((el) => el.textContent)) || '';
    if (x.includes('重做本轮')) {
      await h.click();
      foundRedo = true;
      break;
    }
  }
  check('错题本进入重做模式', foundRedo);
  await new Promise((r) => setTimeout(r, 700));
  await clickBtn('退出重做').catch(() => {});

  // ===== 6. 速记卡翻卡 =====
  await page.goto(BASE + '/#/cards', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 900));
  t = await text();
  check('速记卡页加载', /张卡片/.test(t), (t.match(/\d+ 张卡片/) || [''])[0]);
  await page.evaluate(() => {
    const el = document.querySelector('[style*="preserve-3d"]');
    if (el) el.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  t = await text();
  check('速记卡翻面显示答案', t.includes('答案'));
  await clickBtn('认识了');
  await new Promise((r) => setTimeout(r, 500));
  t = await text();
  check('速记卡「认识了」推进', /已认识 1/.test(t));

  // ===== 7. 计划勾选 + 打印文档挂载（stub 掉 window.print 避免无头浏览器挂起） =====
  await page.goto(BASE + '/#/plan', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1000));
  t = await text();
  check('计划页 5 周渲染', t.includes('第 5 周'));
  await page.evaluate(() => {
    window.__printCalled = 0;
    window.print = () => { window.__printCalled++; };
  });
  await clickBtn('打印').catch(() => {});
  await new Promise((r) => setTimeout(r, 900));
  const printState = await page.evaluate(() => ({
    mounted: (document.getElementById('print-root')?.innerHTML.length || 0) > 500,
    called: window.__printCalled,
  }));
  check('计划打印文档可挂载并调起打印', printState.mounted && printState.called > 0, JSON.stringify(printState));

  // ===== 8. 设置：保存姓名与考试日期（stub alert，避免无头浏览器模态阻塞） =====
  await page.goto(BASE + '/#/settings', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => {
    window.alert = () => {};
    const inputs = [...document.querySelectorAll('input')];
    const name = inputs[0];
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(name, '小李');
    name.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await clickBtn('保存设置');
  await new Promise((r) => setTimeout(r, 600));
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ckxuexi.v1.settings') || '{}').name);
  check('设置保存生效', saved === '小李', saved);

  // ===== 9. 汇总 =====
  check('全程无未捕获页面异常', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '));
  const realConsoleErrors = consoleErrors.filter((e) => !e.includes('Download the React DevTools'));
  check('全程无控制台错误', realConsoleErrors.length === 0, realConsoleErrors.slice(0, 2).join(' | '));
} catch (e) {
  check('测试执行中断', false, String(e).slice(0, 300));
  await page.screenshot({ path: OUT + '/failure2.png' }).catch(() => {});
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n==== 第二轮回归：${results.length - failed.length}/${results.length} 通过 ====`);
if (pageErrors.length) console.log('页面异常明细:', pageErrors.join('\n'));
process.exit(failed.length ? 1 : 0);

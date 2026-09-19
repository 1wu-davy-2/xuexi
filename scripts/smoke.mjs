import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const exe = ['C:/Users/ww/AppData/Local/Google/Chrome/Application/chrome.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p));
const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 1000 } });
const page = await browser.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push('pageerror: ' + String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 200)); });

await page.goto('http://localhost:5266/', { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 1500));
const t = await page.evaluate(() => document.body.innerText);
console.log('倒计时:', /距离江苏成考还有/.test(t.replace(/\n/g, '')) ? 'OK' : 'MISSING');
console.log('三科卡片:', (['政治', '英语', '高等数学（一）'].every((s) => t.includes(s))) ? 'OK' : 'MISSING');
console.log('导航项:', (['冲刺计划', '课程学习', '模拟考试', '错题本', '速记卡'].every((s) => t.includes(s))) ? 'OK' : 'MISSING');
console.log('错误:', errs.length ? errs.join(' | ') : '无');
await page.screenshot({ path: 'e2e-out/smoke-home.png' });
await browser.close();
console.log('screenshot saved');

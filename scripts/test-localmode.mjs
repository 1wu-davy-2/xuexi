/** 本地模式降级验证：后端不可达时，应用应自动进入本地模式（不卡登录页） */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const exe = ['C:/Users/ww/AppData/Local/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p));
const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 1000 } });
const page = await browser.newPage();
await page.goto('http://localhost:5266/#/', { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 2500));
const t = await page.evaluate(() => document.body.innerText);
const ok = t.includes('本地模式') && t.includes('距离江苏成考还有');
console.log('LOCAL-MODE:', ok ? 'OK - 无后端时自动进入本地模式且应用可用' : 'FAIL: ' + t.slice(0, 150).replace(/\n/g, '|'));
await browser.close();
process.exit(ok ? 0 : 1);

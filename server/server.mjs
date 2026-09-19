/**
 * 成考冲刺 · 轻量后端（零 npm 依赖）
 * - 静态托管 dist/（SPA 回退 index.html）
 * - 登录鉴权（SQLite 存用户与会话，默认账号 admin / admin@123）
 * - 用户进度数据存取（SQLite 持久化，容器挂卷后升级不丢数据）
 *
 * 环境变量：PORT(默认3000) DATA_DIR(默认 ../data) ADMIN_PASSWORD(默认 admin@123) SESSION_DAYS(默认7)
 * 要求 Node >= 22.13（内置 node:sqlite）
 */
import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 7);

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, 'app.db'));
db.exec(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  pass_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS progress (
  user_id INTEGER PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
`);
db.exec(`DELETE FROM sessions WHERE expires_at < ${Date.now()}`);

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}
function verifyPassword(password, salt, expected) {
  const actual = hashPassword(password, salt);
  return actual.length === expected.length && crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

// 首次启动：播种默认管理员
if (!db.prepare('SELECT id FROM users LIMIT 1').get()) {
  const username = process.env.ADMIN_USER || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin@123';
  const salt = crypto.randomBytes(16).toString('hex');
  db.prepare('INSERT INTO users (username, pass_hash, salt, created_at) VALUES (?, ?, ?, ?)').run(
    username, hashPassword(password, salt), salt, Date.now(),
  );
  console.log(`[init] 已创建默认账号 ${username}（密码来自 ADMIN_PASSWORD 或默认值，建议部署后修改）`);
}

// ---------- 工具 ----------
function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

function readBody(req, limit = 4 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

function getToken(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
}

function authUser(req) {
  const token = getToken(req);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const row = db
    .prepare(
      `SELECT s.user_id AS uid, u.username AS username FROM sessions s
       JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > ?`,
    )
    .get(token, Date.now());
  return row || null;
}

// 登录限速：单 IP 每 10 分钟最多 12 次
const loginFails = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const rec = loginFails.get(ip);
  if (!rec || now > rec.resetAt) {
    loginFails.set(ip, { count: 0, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  return rec.count >= 12;
}
function recordFail(ip) {
  const rec = loginFails.get(ip);
  if (rec) rec.count++;
}

// ---------- API ----------
async function handleApi(req, res, url) {
  const route = `${req.method} ${url.pathname}`;
  const ip = (req.socket.remoteAddress || 'unknown').replace('::ffff:', '');

  if (route === 'POST /api/login') {
    if (rateLimited(ip)) return json(res, 429, { error: '尝试次数过多，请 10 分钟后再试' });
    const body = await readBody(req);
    const username = String(body.username || '').trim();
    const password = String(body.password || '');
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user || !verifyPassword(password, user.salt, user.pass_hash)) {
      recordFail(ip);
      return json(res, 401, { error: '用户名或密码错误' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + SESSION_DAYS * 86400 * 1000;
    db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, user.id, expiresAt);
    return json(res, 200, { token, username: user.username, expiresAt });
  }

  if (route === 'GET /api/ping') {
    return json(res, 200, { ok: true });
  }

  if (route === 'POST /api/logout') {
    const token = getToken(req);
    if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return json(res, 200, { ok: true });
  }

  if (route === 'GET /api/session') {
    const u = authUser(req);
    if (!u) return json(res, 401, { error: '未登录' });
    return json(res, 200, { username: u.username });
  }

  if (route === 'GET /api/progress') {
    const u = authUser(req);
    if (!u) return json(res, 401, { error: '未登录' });
    const row = db.prepare('SELECT data, updated_at FROM progress WHERE user_id = ?').get(u.uid);
    return json(res, 200, { progress: row ? JSON.parse(row.data) : null, updatedAt: row ? row.updated_at : null });
  }

  if (route === 'PUT /api/progress') {
    const u = authUser(req);
    if (!u) return json(res, 401, { error: '未登录' });
    const body = await readBody(req);
    if (typeof body.progress !== 'object' || body.progress == null) {
      return json(res, 400, { error: 'progress 字段缺失' });
    }
    const data = JSON.stringify(body.progress);
    const now = Date.now();
    db.prepare(
      `INSERT INTO progress (user_id, data, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    ).run(u.uid, data, now);
    return json(res, 200, { ok: true, updatedAt: now });
  }

  return json(res, 404, { error: 'not found' });
}

// ---------- 静态资源 ----------
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};

function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/index.html';
  const file = path.normalize(path.join(DIST, rel));
  if (!file.startsWith(DIST)) {
    res.writeHead(403);
    return res.end('forbidden');
  }
  let target = file;
  if (!fs.existsSync(target) || fs.statSync(target).isDirectory()) {
    target = path.join(DIST, 'index.html'); // SPA 回退
  }
  const ext = path.extname(target).toLowerCase();
  const isAsset = rel.startsWith('/assets/');
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': isAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  fs.createReadStream(target).pipe(res);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    return serveStatic(req, res, url);
  } catch (e) {
    const msg = e && e.message === 'invalid json' ? '请求格式错误' : e && e.message === 'body too large' ? '请求体过大' : '服务器内部错误';
    if (msg === '服务器内部错误') console.error('[error]', route, e);
    if (!res.headersSent) json(res, msg === '请求格式错误' || msg === '请求体过大' ? 400 : 500, { error: msg });
  }
});

server.listen(PORT, () => {
  console.log(`[ok] 成考冲刺服务已启动: http://localhost:${PORT}（数据目录 ${DATA_DIR}）`);
});

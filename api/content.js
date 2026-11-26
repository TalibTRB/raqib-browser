'use strict';

const crypto = require('crypto');

/**
 * RAQİB Live Inline Content CMS API (Vercel Serverless Function)
 *
 * - Zero visitor tracking, zero cookies for public visitors (read-only GET returns published overrides).
 * - Admin authentication reuses existing `STATS_ADMIN_KEY` with timing-safe comparison and
 *   HMAC-SHA256 signed `HttpOnly; SameSite=Strict` session cookies (plus `x-stats-key` SSO).
 * - Dual persistence matching `/api/stats`: Upstash Redis / Vercel KV (instant worldwide sync)
 *   with seamless fallback to Private GitHub Gist (`raqib-cms-overrides.json`).
 * - Strict server-side HTML sanitization allowing ONLY harmless inline formatting (`strong`, `b`, `em`, `i`, `code`, `br`).
 */

const COOKIE_NAME = 'raqib_admin_session';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const ALLOWED_PAGES = new Set(['index', 'privacy']);
const MAX_KEYS_PER_PAGE = 600;
const MAX_VALUE_LENGTH = 8000;
const MAX_BODY_BYTES = 512 * 1024;

function timingSafeEqualStr(a, b) {
  const bufA = Buffer.from(String(a || ''), 'utf8');
  const bufB = Buffer.from(String(b || ''), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function getAdminKey() {
  return String(process.env.STATS_ADMIN_KEY || '').trim();
}

function parseCookies(req) {
  const header = String((req && req.headers && req.headers.cookie) || '');
  const out = {};
  if (!header) return out;
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function createSessionCookieToken(secret, nowMs = Date.now()) {
  const exp = Math.floor(nowMs / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${exp}`;
  const sig = crypto.createHmac('sha256', `raqib-cms:${secret}`).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function verifySessionCookieToken(token, secret, nowMs = Date.now()) {
  if (!token || !secret) return false;
  const parts = String(token).split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp <= Math.floor(nowMs / 1000)) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expectedSig = crypto.createHmac('sha256', `raqib-cms:${secret}`).update(payload).digest('hex');
  return timingSafeEqualStr(parts[2], expectedSig);
}

function isRequestAuthenticated(req, adminKey) {
  if (!adminKey) return false;
  const authHeader = String((req.headers && req.headers.authorization) || '');
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const headerKey = bearer || String((req.headers && req.headers['x-stats-key']) || '').trim();
  if (headerKey && timingSafeEqualStr(headerKey, adminKey)) {
    return true;
  }
  const cookies = parseCookies(req);
  if (cookies[COOKIE_NAME] && verifySessionCookieToken(cookies[COOKIE_NAME], adminKey)) {
    return true;
  }
  return false;
}

function buildCookieHeader(value, maxAgeSeconds, req) {
  const proto = String((req && req.headers && req.headers['x-forwarded-proto']) || '').toLowerCase();
  const isSecure = proto === 'https' || process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAgeSeconds}`
  ];
  if (isSecure) parts.push('Secure');
  return parts.join('; ');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Strictly sanitizes editable content:
 * - Preserves ONLY zero-attribute inline formatting tags: <strong>, <b>, <em>, <i>, <code>, <br>
 * - Escapes ALL other tags, attributes, event handlers, scripts, iframes, and dangerous protocols.
 */
function sanitizeEditableHtml(raw) {
  let s = String(raw == null ? '' : raw);
  if (s.length > MAX_VALUE_LENGTH) {
    s = s.slice(0, MAX_VALUE_LENGTH);
  }
  // Remove completely disallowed dangerous blocks including inner content
  s = s.replace(/<(script|style|iframe|object|embed|svg|math)[^>]*>[\s\S]*?<\/\1>/gi, '');

  // Tokenize allowed harmless inline tags (stripping any attributes on them!)
  const tokens = [];
  const makeToken = (tagHtml) => {
    const id = `\u0000RQBTAG${tokens.length}\u0000`;
    tokens.push(tagHtml);
    return id;
  };

  s = s.replace(/<\s*(\/?)\s*(strong|b|em|i|code)\b[^>]*>/gi, (_, slash, name) => {
    return makeToken(`<${slash ? '/' : ''}${name.toLowerCase()}>`);
  });
  s = s.replace(/<\s*br\s*\/?\s*>/gi, () => makeToken('<br>'));

  // Escape everything else so ZERO arbitrary HTML/JS/attributes can survive
  s = escapeHtml(s);

  // Restore safe inline formatting tokens
  for (let i = 0; i < tokens.length; i++) {
    s = s.split(`\u0000RQBTAG${i}\u0000`).join(tokens[i]);
  }
  return s.trim();
}

function isValidOverrideKey(key) {
  return typeof key === 'string' && key.length > 0 && key.length <= 120 && /^[a-zA-Z0-9._-]+$/.test(key);
}

function applyPatchToOverrides(existing, patch, deleteKeys) {
  const next = Object.assign({}, existing && typeof existing === 'object' ? existing : {});
  if (Array.isArray(deleteKeys)) {
    deleteKeys.forEach((k) => {
      if (isValidOverrideKey(k)) delete next[k];
    });
  }
  if (patch && typeof patch === 'object' && !Array.isArray(patch)) {
    Object.keys(patch).forEach((k) => {
      if (!isValidOverrideKey(k)) return;
      const val = patch[k];
      if (val === null || val === undefined) {
        delete next[k];
      } else {
        next[k] = sanitizeEditableHtml(val);
      }
    });
  }
  const keys = Object.keys(next);
  if (keys.length > MAX_KEYS_PER_PAGE) {
    throw new Error('too_many_keys');
  }
  return next;
}

function getRedisConfig() {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').replace(/\/+$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
  return url && token ? { url, token } : null;
}

function getGistConfig() {
  const gistId = String(process.env.RAQIB_STATS_GIST_ID || '').trim();
  const ghToken = String(process.env.RAQIB_STATS_GITHUB_TOKEN || '').trim();
  return gistId && ghToken ? { gistId, ghToken } : null;
}

function detectStorageBackend() {
  if (getRedisConfig()) return 'upstash-redis';
  if (getGistConfig()) return 'github-gist';
  return 'none';
}

async function readPageFromRedis(redis, page) {
  const key = `raqib:cms:${page}`;
  const res = await fetch(`${redis.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redis.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([['GET', key]])
  });
  if (!res.ok) throw new Error(`redis_read_http_${res.status}`);
  const rows = await res.json();
  const raw = rows && rows[0] && rows[0].result;
  if (!raw) return { overrides: {}, updatedAt: null };
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return {
    overrides: (parsed && typeof parsed.overrides === 'object' && parsed.overrides) || {},
    updatedAt: (parsed && parsed.updatedAt) || null
  };
}

async function writePageToRedis(redis, page, record) {
  const key = `raqib:cms:${page}`;
  const res = await fetch(`${redis.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redis.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([['SET', key, JSON.stringify(record)]])
  });
  if (!res.ok) throw new Error(`redis_write_http_${res.status}`);
}

async function readAllFromGist(gistCfg) {
  const res = await fetch(`https://api.github.com/gists/${encodeURIComponent(gistCfg.gistId)}`, {
    headers: {
      Authorization: `Bearer ${gistCfg.ghToken}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'RAQIB-CMS/1.0'
    }
  });
  if (!res.ok) throw new Error(`gist_read_http_${res.status}`);
  const gist = await res.json();
  const file = gist && gist.files && gist.files['raqib-cms-overrides.json'];
  if (!file || !file.content) return {};
  try {
    return JSON.parse(file.content) || {};
  } catch (_) {
    return {};
  }
}

async function writePageToGist(gistCfg, page, record) {
  const all = await readAllFromGist(gistCfg);
  all[page] = record;
  const res = await fetch(`https://api.github.com/gists/${encodeURIComponent(gistCfg.gistId)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${gistCfg.ghToken}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'RAQIB-CMS/1.0'
    },
    body: JSON.stringify({
      files: {
        'raqib-cms-overrides.json': { content: JSON.stringify(all, null, 2) }
      }
    })
  });
  if (!res.ok) throw new Error(`gist_write_http_${res.status}`);
}

async function loadPageRecord(page) {
  const redis = getRedisConfig();
  if (redis) {
    const rec = await readPageFromRedis(redis, page);
    return { ...rec, backend: 'upstash-redis' };
  }
  const gist = getGistConfig();
  if (gist) {
    const all = await readAllFromGist(gist);
    const rec = all[page] || {};
    return {
      overrides: (rec && typeof rec.overrides === 'object' && rec.overrides) || {},
      updatedAt: (rec && rec.updatedAt) || null,
      backend: 'github-gist'
    };
  }
  return { overrides: {}, updatedAt: null, backend: 'none' };
}

async function savePageRecord(page, record) {
  const redis = getRedisConfig();
  if (redis) {
    await writePageToRedis(redis, page, record);
    return 'upstash-redis';
  }
  const gist = getGistConfig();
  if (gist) {
    await writePageToGist(gist, page, record);
    return 'github-gist';
  }
  throw new Error('storage_not_configured');
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    return req.body.trim() ? JSON.parse(req.body) : {};
  }
  return await new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        reject(new Error('body_too_large'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf8').trim();
        resolve(text ? JSON.parse(text) : {});
      } catch (err) {
        reject(new Error('invalid_json'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}

async function handler(req, res) {
  const method = String(req.method || 'GET').toUpperCase();
  const adminKey = getAdminKey();
  const backend = detectStorageBackend();

  if (method === 'GET') {
    const rawPage = String((req.query && req.query.page) || 'index').trim().toLowerCase();
    const page = ALLOWED_PAGES.has(rawPage) ? rawPage : 'index';
    const isAdmin = isRequestAuthenticated(req, adminKey);
    try {
      const loaded = await loadPageRecord(page);
      sendJson(res, 200, {
        ok: true,
        page,
        overrides: loaded.overrides,
        updatedAt: loaded.updatedAt,
        isAdmin,
        adminKeyConfigured: Boolean(adminKey),
        storageConfigured: backend !== 'none',
        storageBackend: loaded.backend
      });
    } catch (_) {
      sendJson(res, 200, {
        ok: true,
        page,
        overrides: {},
        updatedAt: null,
        isAdmin,
        adminKeyConfigured: Boolean(adminKey),
        storageConfigured: backend !== 'none',
        storageBackend: backend
      });
    }
    return;
  }

  if (method !== 'POST') {
    sendJson(res, 405, { error: 'method_not_allowed' });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    sendJson(res, 400, { error: err.message || 'invalid_json' });
    return;
  }

  const action = String((body && body.action) || '').trim().toLowerCase();

  if (action === 'logout') {
    res.setHeader('Set-Cookie', buildCookieHeader('', 0, req));
    sendJson(res, 200, { ok: true, isAdmin: false });
    return;
  }

  if (action === 'login') {
    if (!adminKey) {
      sendJson(res, 503, { error: 'admin_key_not_configured' });
      return;
    }
    const provided = String((body && body.key) || '').trim();
    if (!provided || !timingSafeEqualStr(provided, adminKey)) {
      sendJson(res, 401, { error: 'unauthorized' });
      return;
    }
    const token = createSessionCookieToken(adminKey);
    res.setHeader('Set-Cookie', buildCookieHeader(token, SESSION_TTL_SECONDS, req));
    sendJson(res, 200, {
      ok: true,
      isAdmin: true,
      storageConfigured: backend !== 'none',
      storageBackend: backend
    });
    return;
  }

  // All write actions below require valid STATS_ADMIN_KEY session or header
  if (!adminKey) {
    sendJson(res, 503, { error: 'admin_key_not_configured' });
    return;
  }
  if (!isRequestAuthenticated(req, adminKey)) {
    sendJson(res, 401, { error: 'unauthorized' });
    return;
  }

  const page = String((body && body.page) || '').trim().toLowerCase();
  if (!ALLOWED_PAGES.has(page)) {
    sendJson(res, 400, { error: 'invalid_page' });
    return;
  }
  if (backend === 'none') {
    sendJson(res, 503, { error: 'storage_not_configured' });
    return;
  }

  if (action === 'save') {
    try {
      const current = await loadPageRecord(page);
      const nextOverrides = applyPatchToOverrides(current.overrides, body.patch, body.deleteKeys);
      const updatedAt = new Date().toISOString();
      const usedBackend = await savePageRecord(page, { overrides: nextOverrides, updatedAt });
      sendJson(res, 200, {
        ok: true,
        page,
        overrides: nextOverrides,
        updatedAt,
        storageBackend: usedBackend
      });
    } catch (err) {
      const status = err.message === 'too_many_keys' ? 400 : 500;
      sendJson(res, status, { error: err.message || 'save_failed' });
    }
    return;
  }

  if (action === 'reset') {
    try {
      const current = await loadPageRecord(page);
      const nextOverrides = Object.assign({}, current.overrides);
      const langPrefix = typeof body.lang === 'string' && /^[a-z]{2}$/.test(body.lang) ? `${body.lang}.` : '';
      if (Array.isArray(body.keys) && body.keys.length > 0) {
        body.keys.forEach((k) => {
          if (isValidOverrideKey(k)) delete nextOverrides[k];
        });
      } else if (langPrefix) {
        Object.keys(nextOverrides).forEach((k) => {
          if (k.startsWith(langPrefix)) delete nextOverrides[k];
        });
      } else {
        Object.keys(nextOverrides).forEach((k) => delete nextOverrides[k]);
      }
      const updatedAt = new Date().toISOString();
      const usedBackend = await savePageRecord(page, { overrides: nextOverrides, updatedAt });
      sendJson(res, 200, {
        ok: true,
        page,
        overrides: nextOverrides,
        updatedAt,
        storageBackend: usedBackend
      });
    } catch (err) {
      sendJson(res, 500, { error: err.message || 'reset_failed' });
    }
    return;
  }

  sendJson(res, 400, { error: 'unknown_action' });
}

handler._internal = {
  timingSafeEqualStr,
  createSessionCookieToken,
  verifySessionCookieToken,
  sanitizeEditableHtml,
  isValidOverrideKey,
  applyPatchToOverrides
};

module.exports = handler;

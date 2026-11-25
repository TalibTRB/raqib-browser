'use strict';

const crypto = require('crypto');

/**
 * RAQİB Privacy-First Download & Country Statistics API (Vercel Serverless Function)
 *
 * Combines:
 * 1. Live official GitHub Releases asset download counts (always works with zero configuration!)
 * 2. Persistent country-code & daily breakdown from Upstash Redis / Vercel KV or Private GitHub Gist
 *    (strictly aggregate counts — zero IP addresses, zero personal data!)
 * 3. Optional owner password protection via `STATS_ADMIN_KEY` Vercel environment variable.
 */

const REPO = 'TalibTRB/raqib-browser';

function timingSafeEqualStr(a, b) {
  const bufA = Buffer.from(String(a || ''), 'utf8');
  const bufB = Buffer.from(String(b || ''), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function getRedisConfig() {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').replace(/\/+$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
  return url && token ? { url, token } : null;
}

function parseRedisHashArray(arr) {
  const out = {};
  if (!Array.isArray(arr)) return out;
  for (let i = 0; i + 1 < arr.length; i += 2) {
    out[String(arr[i])] = Number(arr[i + 1]) || 0;
  }
  return out;
}

async function fetchRedisStats(redis) {
  const commands = [
    ['GET', 'raqib:dl:total'],
    ['HGETALL', 'raqib:dl:countries'],
    ['HGETALL', 'raqib:dl:daily'],
    ['HGETALL', 'raqib:dl:targets']
  ];
  const res = await fetch(`${redis.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redis.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commands)
  });
  if (!res.ok) return null;
  const rows = await res.json();
  return {
    backend: 'upstash-redis',
    total: Number(rows[0] && rows[0].result) || 0,
    countries: parseRedisHashArray(rows[1] && rows[1].result),
    daily: parseRedisHashArray(rows[2] && rows[2].result),
    targets: parseRedisHashArray(rows[3] && rows[3].result)
  };
}

async function fetchGistStats() {
  const gistId = process.env.RAQIB_STATS_GIST_ID || '';
  const ghToken = process.env.RAQIB_STATS_GITHUB_TOKEN || '';
  if (!gistId || !ghToken) return null;
  const res = await fetch(`https://api.github.com/gists/${encodeURIComponent(gistId)}`, {
    headers: {
      Authorization: `Bearer ${ghToken}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'RAQIB-Stats-Dashboard/1.0'
    }
  });
  if (!res.ok) return null;
  const gist = await res.json();
  const raw = gist.files && gist.files['raqib-stats.json'] ? gist.files['raqib-stats.json'].content : '{}';
  let data = {};
  try { data = JSON.parse(raw); } catch (_) { data = {}; }
  return {
    backend: 'github-gist',
    total: Number(data.total) || 0,
    countries: data.countries || {},
    daily: data.daily || {},
    targets: data.targets || {}
  };
}

async function fetchGithubReleaseCounts() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=15`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'RAQIB-Stats-Dashboard/1.0'
      }
    });
    if (!res.ok) return { totalDownloads: 0, releases: [] };
    const list = await res.json();
    let totalDownloads = 0;
    const releases = (Array.isArray(list) ? list : []).map((rel) => {
      const assets = (Array.isArray(rel.assets) ? rel.assets : []).map((a) => {
        const count = Number(a.download_count) || 0;
        totalDownloads += count;
        return {
          name: String(a.name || ''),
          size: Number(a.size) || 0,
          downloads: count
        };
      });
      return {
        tag: String(rel.tag_name || ''),
        publishedAt: String(rel.published_at || ''),
        assets
      };
    });
    return { totalDownloads, releases };
  } catch (_) {
    return { totalDownloads: 0, releases: [] };
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const adminKey = (process.env.STATS_ADMIN_KEY || '').trim();
  if (adminKey) {
    const authHeader = String(req.headers['authorization'] || '');
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const provided = bearer || String(req.headers['x-stats-key'] || '').trim();
    if (!provided || !timingSafeEqualStr(provided, adminKey)) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'unauthorized', passwordRequired: true }));
      return;
    }
  }

  const redis = getRedisConfig();
  const [tracked, github] = await Promise.all([
    (async () => {
      try {
        if (redis) return await fetchRedisStats(redis);
        return await fetchGistStats();
      } catch (_) {
        return null;
      }
    })(),
    fetchGithubReleaseCounts()
  ]);

  const payload = {
    generatedAt: new Date().toISOString(),
    passwordProtected: Boolean(adminKey),
    storageConfigured: Boolean(tracked),
    storageBackend: tracked ? tracked.backend : 'none',
    tracked: tracked || {
      backend: 'none',
      total: 0,
      countries: {},
      daily: {},
      targets: {}
    },
    github
  };

  res.statusCode = 200;
  res.end(JSON.stringify(payload));
};

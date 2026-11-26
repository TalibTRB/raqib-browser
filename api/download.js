'use strict';

/**
 * RAQİB Zero-Telemetry Download Redirect & Country Counter (Vercel Serverless Function)
 *
 * Privacy guarantee:
 * - Reads ONLY the 2-letter ISO country header (`x-vercel-ip-country`) supplied by Vercel's edge.
 * - NEVER logs, hashes, or persists IP addresses, cookies, User-Agents, or device identifiers.
 * - Immediately 302-redirects to the official signed asset on GitHub Releases even if storage
 *   is unconfigured or unreachable — downloads NEVER fail.
 */

const REPO = 'TalibTRB/raqib-browser';
const FALLBACK_VERSION = 'v1.1.3';
const FALLBACK_EXT_VERSION = 'v1.0.0';

const ASSET_MATCHERS = {
  apk: {
    suffix: '.apk',
    fallbackUrl: `https://github.com/${REPO}/releases/download/${FALLBACK_VERSION}/RAQIB-${FALLBACK_VERSION}-signed-release.apk`
  },
  'ext-edge': {
    contains: 'Edge-Brave.zip',
    fallbackUrl: `https://github.com/${REPO}/releases/download/${FALLBACK_VERSION}/RAQIB-Extension-${FALLBACK_EXT_VERSION}-Edge-Brave.zip`
  },
  'ext-firefox': {
    contains: 'Firefox.zip',
    fallbackUrl: `https://github.com/${REPO}/releases/download/${FALLBACK_VERSION}/RAQIB-Extension-${FALLBACK_EXT_VERSION}-Firefox.zip`
  }
};

function sanitizeCountry(raw) {
  const cc = String(raw || '').trim().toUpperCase();
  return /^[A-Z]{2}$/.test(cc) ? cc : 'XX';
}

function sanitizeTarget(raw) {
  const t = String(raw || 'apk').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(ASSET_MATCHERS, t) ? t : 'apk';
}

function getRedisConfig() {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').replace(/\/+$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
  return url && token ? { url, token } : null;
}

async function recordDownloadInRedis(redis, country, target) {
  const day = new Date().toISOString().slice(0, 10);
  const commands = [
    ['INCR', 'raqib:dl:total'],
    ['HINCRBY', 'raqib:dl:countries', country, '1'],
    ['HINCRBY', 'raqib:dl:daily', day, '1'],
    ['HINCRBY', 'raqib:dl:targets', target, '1'],
    ['HINCRBY', `raqib:dl:target_countries:${target}`, country, '1']
  ];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1600);
  try {
    await fetch(`${redis.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redis.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commands),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

async function recordDownloadInGist(country, target) {
  const gistId = process.env.RAQIB_STATS_GIST_ID || '';
  const ghToken = process.env.RAQIB_STATS_GITHUB_TOKEN || '';
  if (!gistId || !ghToken) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);
  try {
    const getRes = await fetch(`https://api.github.com/gists/${encodeURIComponent(gistId)}`, {
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'RAQIB-Download-Counter/1.0'
      },
      signal: controller.signal
    });
    if (!getRes.ok) return;
    const gist = await getRes.json();
    const rawContent = gist.files && gist.files['raqib-stats.json'] ? gist.files['raqib-stats.json'].content : '{}';
    let data = {};
    try { data = JSON.parse(rawContent); } catch (_) { data = {}; }
    const day = new Date().toISOString().slice(0, 10);
    data.total = (Number(data.total) || 0) + 1;
    data.countries = data.countries || {};
    data.countries[country] = (Number(data.countries[country]) || 0) + 1;
    data.daily = data.daily || {};
    data.daily[day] = (Number(data.daily[day]) || 0) + 1;
    data.targets = data.targets || {};
    data.targets[target] = (Number(data.targets[target]) || 0) + 1;

    await fetch(`https://api.github.com/gists/${encodeURIComponent(gistId)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'RAQIB-Download-Counter/1.0'
      },
      body: JSON.stringify({
        files: {
          'raqib-stats.json': { content: JSON.stringify(data) }
        }
      }),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

async function resolveLatestAssetUrl(target) {
  const spec = ASSET_MATCHERS[target] || ASSET_MATCHERS.apk;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1800);
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'RAQIB-Download-Router/1.0'
      },
      signal: controller.signal
    });
    if (!res.ok) return spec.fallbackUrl;
    const rel = await res.json();
    const assets = Array.isArray(rel.assets) ? rel.assets : [];
    const match = assets.find((a) => {
      const name = String(a.name || '');
      if (spec.suffix) return name.toLowerCase().endsWith(spec.suffix);
      if (spec.contains) return name.includes(spec.contains);
      return false;
    });
    return (match && match.browser_download_url) || spec.fallbackUrl;
  } catch (_) {
    return spec.fallbackUrl;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = async function handler(req, res) {
  const target = sanitizeTarget(req.query && req.query.target);
  const country = sanitizeCountry(
    req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry']
  );

  // Skip counting bots / HEAD prefetches while still redirecting cleanly
  const isHead = req.method === 'HEAD';
  const ua = String(req.headers['user-agent'] || '').toLowerCase();
  const isBot = /bot|crawler|spider|headless|uptime|pingdom/.test(ua);

  const [destUrl] = await Promise.all([
    resolveLatestAssetUrl(target),
    (!isHead && !isBot)
      ? (async () => {
          try {
            const redis = getRedisConfig();
            if (redis) {
              await recordDownloadInRedis(redis, country, target);
            } else {
              await recordDownloadInGist(country, target);
            }
          } catch (_) {
            // Never block or fail a real user download if analytics storage hiccups
          }
        })()
      : Promise.resolve()
  ]);

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Location', destUrl);
  res.statusCode = 302;
  res.end();
};

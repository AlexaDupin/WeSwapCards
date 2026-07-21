const pool = require('../../models/client');

// A real health check: it exercises the dependencies the API actually needs,
// unlike "/" (Hello World) which proves only that the process is up. Returns
// 200 only when everything passes, 503 otherwise, with a JSON body naming what
// passed/failed so an outage is legible at a glance.

const REQUIRED_ENV = [
  'PG_URL',
  'CLERK_SECRET_KEY',
  'CLERK_PUBLISHABLE_KEY',
  'CLERK_SIGNING_SECRET',
  'CORS_URL',
];

// The JWKS probe hits Clerk's network, so cache it to avoid turning /health
// into a way to hammer Clerk (or ourselves).
const JWKS_TTL_MS = 60_000;
let jwksCache = { ok: null, detail: 'not checked yet', checkedAt: 0 };

// Detect whether global fetch is Node's native implementation rather than a
// node-fetch v2 polyfill. This is the exact regression that took prod down:
// node-fetch v2 attaches `isRedirect`/`Promise` statics that native undici
// fetch does not, so their presence means something re-polyfilled fetch.
const fetchIsNative = () => {
  const f = globalThis.fetch;
  if (typeof f !== 'function') return false;
  if (typeof f.isRedirect === 'function') return false;
  if (f.Promise) return false;
  return true;
};

// Derive the JWKS URL from the publishable key (pk_test_/pk_live_ + base64 of
// "<frontend-api-host>$"), so we don't hardcode the Clerk domain.
const jwksUrlFromPublishableKey = (pk) => {
  if (!pk) return null;
  const encoded = pk.replace(/^pk_(test|live)_/, '');
  let decoded;
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    return null;
  }
  const host = decoded.replace(/\$+$/, '');
  if (!host) return null;
  return `https://${host}/.well-known/jwks.json`;
};

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_resolve, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);

const checkDb = async () => {
  try {
    await withTimeout(pool.query('SELECT 1'), 3000, 'db');
    return { ok: true };
  } catch (err) {
    return { ok: false, detail: err.message };
  }
};

const checkEnv = () => {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  return { ok: missing.length === 0, missing };
};

const checkJwks = async () => {
  const now = Date.now();
  if (jwksCache.ok !== null && now - jwksCache.checkedAt < JWKS_TTL_MS) {
    return { ok: jwksCache.ok, detail: jwksCache.detail, cached: true };
  }

  const url = jwksUrlFromPublishableKey(process.env.CLERK_PUBLISHABLE_KEY);
  if (!url) {
    const result = { ok: false, detail: 'could not derive JWKS URL from CLERK_PUBLISHABLE_KEY' };
    jwksCache = { ...result, checkedAt: now };
    return result;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    let body;
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`JWKS endpoint returned ${response.status}`);
      }
      body = await response.json();
    } finally {
      clearTimeout(timer);
    }
    const ok = Array.isArray(body?.keys) && body.keys.length > 0;
    const result = ok
      ? { ok: true }
      : { ok: false, detail: 'JWKS response had no keys' };
    jwksCache = { ...result, checkedAt: now };
    return result;
  } catch (err) {
    const result = { ok: false, detail: err.message };
    jwksCache = { ...result, checkedAt: now };
    return result;
  }
};

const healthController = {
  async health(_req, res) {
    const [db, jwks] = await Promise.all([checkDb(), checkJwks()]);
    const env = checkEnv();
    const nativeFetch = fetchIsNative();

    const clerk = {
      ok: jwks.ok && nativeFetch,
      fetchNative: nativeFetch,
      jwks,
    };

    const healthy = db.ok && env.ok && clerk.ok;

    res.status(healthy ? 200 : 503).json({
      status: healthy ? 'ok' : 'degraded',
      checks: { db, env, clerk },
      node: process.version,
      uptime: process.uptime(),
    });
  },
};

module.exports = healthController;

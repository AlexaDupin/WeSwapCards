// Drop-in replacement for Clerk's `requireAuth()`.
//
// Clerk's requireAuth() responds to any missing `req.auth.userId` with a 302
// redirect to "/". That makes two very different situations look identical:
//   1. a genuinely signed-out / expired-token request (a client problem), and
//   2. Clerk's own token verification throwing internally ("unexpected-error").
// The second is what caused the silent production outage: a server fault was
// disguised as a logged-out user and masked by a 302 -> "/" -> 200 "Hello World".
//
// This middleware never redirects. `clerkMiddleware()` has already run app-wide
// and populated `req.auth` and appended the Clerk auth headers to the response,
// so we inspect those and translate to explicit JSON status codes.

// Clerk appends these to the response during clerkMiddleware().
const REASON_HEADER = 'x-clerk-auth-reason';
const STATUS_HEADER = 'x-clerk-auth-status';
const MESSAGE_HEADER = 'x-clerk-auth-message';

// The only `AuthErrorReason` (from @clerk/backend) that denotes a server-side
// verification fault rather than a signed-out / handshake condition. Everything
// else (token missing/expired/nbf, uat mismatches, dev-browser sync, ...) is a
// client problem that legitimately maps to 401.
const SERVER_FAULT_REASON = 'unexpected-error';

const readHeader = (res, name) => {
  const value = res.getHeader(name);
  return Array.isArray(value) ? value[0] : value;
};

const requireApiAuth = (req, res, next) => {
  if (req.auth?.userId) {
    return next();
  }

  const reason = String(readHeader(res, REASON_HEADER) ?? 'unknown');
  const status = String(readHeader(res, STATUS_HEADER) ?? '');
  const message = String(readHeader(res, MESSAGE_HEADER) ?? '');

  // Server-side verification fault (e.g. broken fetch/JWKS). This is NOT a
  // signed-out user — surface it as a 500 so it hits the central error handler,
  // gets logged loudly, and is impossible to mistake for an outage again.
  if (reason.includes(SERVER_FAULT_REASON)) {
    console.error(
      `[auth] Clerk verification fault on ${req.method} ${req.originalUrl}: ` +
        `status=${status} reason=${reason} message=${message}`,
    );
    const err = new Error(`Clerk auth verification failed: ${message || reason}`);
    err.status = 500;
    err.clerk = { status, reason, message };
    return next(err);
  }

  // Genuine unauthenticated request (no/expired/invalid token). The client can
  // act on `reason` (e.g. refresh the token or send the user to sign-in).
  console.warn(
    `[auth] Unauthenticated ${req.method} ${req.originalUrl}: reason=${reason}`,
  );
  return res.status(401).json({ error: 'Unauthenticated', reason });
};

module.exports = requireApiAuth;

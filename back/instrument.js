// Sentry initialization. This file is required as early as possible in index.js
// (right after the fetch polyfill guard) so Sentry can instrument the runtime
// before Express/Clerk/pg are loaded.
//
// It is a no-op unless SENTRY_DSN is set, so environments without a DSN (local
// dev, o2switch until you opt in) run exactly as before. Turn it on by setting
// SENTRY_DSN in the environment (e.g. on Render).

// Load env here too: instrument.js runs before index.js calls dotenv.config(),
// and Sentry.init needs SENTRY_DSN at import time.
require('dotenv').config();

const Sentry = require('@sentry/node');

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    // Keep the SDK's own verbose debug logging OFF. Without this explicit false,
    // Sentry falls back to reading the SENTRY_DEBUG env var and would flood the
    // logs with per-span "[Tracing] ..." lines.
    debug: false,
    // Tracing: sample 20% of requests. @sentry/node auto-instruments Express,
    // Postgres (pg), and outgoing HTTP, so this surfaces slow endpoints/queries
    // and gives each error the request trace that led to it. Raise toward 1.0
    // for more detail, lower it if you approach the spans quota.
    tracesSampleRate: 0.2,
    // Logging: forward console.warn / console.error to Sentry Logs so they sit
    // alongside the errors/traces from the same request. Deliberately NOT
    // capturing console.log/info — that level carries the noisy, PII-heavy
    // output (e.g. the webhook handler logs full Clerk user payloads).
    enableLogs: true,
    integrations: [
      Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
    ],
  });
  console.log('[sentry] initialized (tracing + logs)');
} else {
  console.log('[sentry] SENTRY_DSN not set — error tracking disabled');
}

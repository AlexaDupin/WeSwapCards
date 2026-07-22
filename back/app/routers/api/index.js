const express = require('express');
const routerV1 = require('./v1');
const healthController = require('../../controllers/api/health');

const router = express.Router();

// Real health check (exercises DB + Clerk/env). Public, no auth.
router.get('/health', healthController.health);

// TEMPORARY — Sentry pipeline verification. Only mounted when SENTRY_DEBUG=true,
// so it's a 404 in normal operation. Hitting GET /api/debug-sentry throws; the
// error should reach Sentry (with a stack trace) and come back as a 500 JSON.
// Remove this block and the SENTRY_DEBUG env var once you've confirmed it works.
if (process.env.SENTRY_DEBUG === 'true') {
  router.get('/debug-sentry', () => {
    throw new Error('Sentry verification error: GET /api/debug-sentry');
  });
}

router.use('/v1', routerV1);

module.exports = router;
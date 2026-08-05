const express = require('express');
const routerV1 = require('./v1');
const healthController = require('../../controllers/api/health');

const router = express.Router();

// Real health check (exercises DB + Clerk/env). Public, no auth.
router.get('/health', healthController.health);

router.use('/v1', routerV1);

module.exports = router;
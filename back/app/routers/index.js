const express = require('express');

const apiRouter = require('./api');
const { apiController } = require('../controllers/api/index');

// const { errorHandler } = require('../helpers/errorHandler');

const router = express.Router();

router.use('/api', apiRouter);
router.all('/', apiController.home);

router.use((err, _, response, next) => {
    throw new error(err.message, { status: 404 });
});

module.exports = router;
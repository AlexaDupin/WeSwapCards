const express = require('express');

const apiRouter = require('./api');
// const { errorHandler } = require('../helpers/errorHandler');

const router = express.Router();

router.use('/api', apiRouter);

router.use((err, _, response, next) => {
    throw new error(err.message, { status: 404 });
});

module.exports = router;
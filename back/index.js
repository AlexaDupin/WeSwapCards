const http = require('http');
require('dotenv').config();
const debug = require('debug')('app:server');
const app = require('./app');

const port = process.env.PORT ?? 3001;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`http://localhost:${port}`);
    debug(`Listening on ${port}`);
});
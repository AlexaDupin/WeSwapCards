const fetch = require('node-fetch');  // Import node-fetch version 2.x
global.fetch = fetch;  // Set fetch globally

// Polyfill global Request (used by Clerk)
global.Request = fetch.Request;  // Set global Request to node-fetch's Request
global.Headers = fetch.Headers;     // Expose Headers globally

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
// const fetch = require('node-fetch');  // Import node-fetch version 2.x
// global.fetch = fetch;  // Set fetch globally

// // Polyfill global Request (used by Clerk)
// global.Request = fetch.Request;  // Set global Request to node-fetch's Request
// global.Headers = fetch.Headers;     // Expose Headers globally

// if (typeof(PhusionPassenger) !== 'undefined') {
//     PhusionPassenger.configure({ autoInstall: false });
// }

// const http = require('http');
// require('dotenv').config();
// const debug = require('debug')('app:server');
// const app = require('./app');

// const port = process.env.PORT ?? 3001;

// const server = http.createServer(app);
 
// if (typeof(PhusionPassenger) !== 'undefined') {
//     server.listen('passenger');
//     console.log(`Listening on passenger`);

// } else {
//     server.listen(`${port}`);
//     console.log(`Listening on ${port}`);
// }

// server.listen(port, () => {
//     // console.log(`http://localhost:${port}`);
//     console.log(`Listening on ${port}`);
//     debug(`Listening on ${port}`);
// });

const fetch = require('node-fetch');  // Import node-fetch version 2.x
global.fetch = fetch;  // Set fetch globally

// Polyfill global Request (used by Clerk)
global.Request = fetch.Request;  // Set global Request to node-fetch's Request
global.Headers = fetch.Headers;     // Expose Headers globally

if (typeof(PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}

const express = require('express');
require('dotenv').config();
const { clerkMiddleware } = require('@clerk/express');

const router = require('./app/routers');
const cors = require('cors');

const app = express();
const port = process.env.PORT ?? 3001;

app.get('/', function(req, res) {
    var body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

// app.listen(3000, () => {
//     console.log("Server Listening on port 3000");
// })

// Payload JSON
app.use(express.json());
// Payload urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

const corsOptions = {
  origin: process.env.CORS_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(router);

if (typeof(PhusionPassenger) !== 'undefined') {
    app.listen('passenger');
    console.log(`Listening on passenger`);

} else {
    app.listen(`${port}`);
    console.log(`Listening on ${port}`);
}

// module.exports = app;
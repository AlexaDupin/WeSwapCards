// const express = require('express');
// const { clerkMiddleware } = require('@clerk/express');
// require('dotenv').config();

// const router = require('./routers');
// const cors = require('cors');

// const app = express();

// app.get('/', function(req, res) {
//     var body = 'Hello World';
//     res.setHeader('Content-Type', 'text/plain');
//     res.setHeader('Content-Length', body.length);
//     res.end(body);
// });

// // Payload JSON
// app.use(express.json());
// // Payload urlencoded
// app.use(express.urlencoded({ extended: true }));
// app.use(clerkMiddleware());

// const corsOptions = {
//     //origin: 'http://localhost:3000',
//     origin: process.env.CORS_URL,
//     // origin: '*',
//     optionsSuccessStatus: 200,
//     credentials: true,
// };

// app.use(cors(corsOptions));

// app.use(router);

// module.exports = app;
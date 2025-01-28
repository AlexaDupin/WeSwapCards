const path = require('path');
const express = require('express');
const { clerkMiddleware } = require('@clerk/express');

// const cookieParser = require('cookie-parser');

const router = require('./routers');
const cors = require('cors');

const app = express();

// Payload JSON
app.use(express.json());
// Payload urlencoded
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());  // This allows access to cookies in `req.cookies`
app.use(clerkMiddleware());

const corsOptions = {
    origin: 'http://localhost:3000',
    // origin: 'https://weswapcards.onrender.com',
    // origin: '*',
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));

app.use(router);

module.exports = app;
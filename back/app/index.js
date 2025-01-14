const path = require('path');
const express = require('express');

const router = require('./routers');
const cors = require('cors');

const app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.use('/assets', express.static(path.join(__dirname,'assets')));

// On active le middleware pour parser le payload JSON
app.use(express.json());
// On active le middleware pour parser le payload urlencoded
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    // origin: 'http://localhost:3000',
    origin: 'https://weswapcards.onrender.com',
    // origin: '*',
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));

app.use(router);

module.exports = app;
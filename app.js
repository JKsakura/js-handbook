// =========================================
// Module Dependencies
// =========================================
const express = require('express');
const dotEnv = require('dotenv').config();
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const debug = require('debug')('js-handbook:server');
const logger = require('morgan');
const mongoose = require('mongoose');
const router = require('./routes/index');

// =========================================
// Private: variables
// =========================================
const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);

// =========================================
// Basic Settings
// =========================================
app.set('views', __dirname + '/public/views');
app.set('view engine', 'pug');
app.set('port', port);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(function(req, res, next) {
    res.locals.domain = process.env.DOMAIN;
    next();
});

router(app);

// =========================================
// Server/DB Config
// =========================================
server.listen(port);
server.on('error', onErrorFunc);
server.on('listening', onListeningFunc);

// =========================================
// Fn Definitions
// =========================================
function onErrorFunc(error) {
    if (error.syscal !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string' ? 'Pipe' + port : "Port" + port;

    switch(error.code) {
        case 'EACCES':
            console.error(bind + " requires evaluated privileges");
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + " is already in user");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListeningFunc() {
    let p = server.address().port;
    debug("Listening on port " + p);
}

// =========================================
// DB
// =========================================
mongoose.connect(process.env.DB_CONNECTION);
const connection = mongoose.connection;

connection.on('error', function(err) {
    console.error("Mongoose default connection error: " + err);
});

connection.on('open', function() {
    console.log("Successfully connected");
});

connection.on('connected', function() {
    console.log("Mongoose default connection open to " + process.env.DB_CONNECTION);
});

connection.on('disconnected', function() {
    console.log("Mongoose default connection disconnected");
});


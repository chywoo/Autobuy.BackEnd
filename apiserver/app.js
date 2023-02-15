var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const {swaggerUi, specs} = require("./swagger");

var config = require('./services/config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/authentication');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', loginRouter);

// Swagger Document
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

module.exports = app;

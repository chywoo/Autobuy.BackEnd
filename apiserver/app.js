var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

const {swaggerUi, specs} = require("./swagger");

const config = require('./services/config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/authentication');
const rolesRouter = require('./routes/roles');
const makesRouter = require('./routes/makes');
const postRouter = require('./routes/posts');
const corRouter = require('./routes/cars');
const keyRouter = require('./routes/keys');
const systemRouter = require('./routes/system');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false,
  secret: "@^%@ASDFY#9823f@",
  saveUninitialized: false
}));

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/roles', rolesRouter);
app.use('/api/v1/auth', loginRouter);
app.use('/api/v1/makes', makesRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/cars', corRouter);
app.use('/api/v1/keys', keyRouter);
app.use('/api/v1/system', systemRouter);

// Swagger Document
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// System handler
app.locals.suspendSystem = false;
app.locals.suspendAccessToken = false;

module.exports = app;

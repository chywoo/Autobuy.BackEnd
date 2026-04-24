"use strict";

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const { swaggerUi, specs } = require('./swagger');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/authentication');
const rolesRouter = require('./routes/roles');
const makesRouter = require('./routes/makes');
const postRouter = require('./routes/posts');
const carRouter = require('./routes/cars');
const keyRouter = require('./routes/keys');

const app = express();

const sessionSecret = process.env.SESSION_SECRET || '@^%@ASDFY#9823f@';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        resave: false,
        secret: sessionSecret,
        saveUninitialized: false,
    })
);

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/roles', rolesRouter);
app.use('/api/v1/auth', loginRouter);
app.use('/api/v1/makes', makesRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/cars', carRouter);
app.use('/api/v1/keys', keyRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

module.exports = app;

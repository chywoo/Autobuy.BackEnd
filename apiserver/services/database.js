"use strict";

const mysql = require('mysql');
const { promisify } = require('util');
const config = require('./config');

const pool = mysql.createPool(config.database);

const query = promisify(pool.query).bind(pool);

module.exports = {
    pool,
    query,
};

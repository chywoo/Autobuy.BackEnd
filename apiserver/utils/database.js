const mysql = require('mysql');
const config = require('./config');

const pool = mysql.createPool(config.database);

/**
 * Execute Query.
 *
 * @param sql Query
 * @param handler Data handler with two parameters(err, row)
 * @constructor
 */
function Query(sql, handler = (err, row))
{
    pool.query(sql, handler(err, row));
}

module.exports = {
    pool
}
const mysql = require('mysql');

var pool = null;
function InitializeDatabase(dbInfo) {
    pool = mysql.createPool(dbInfo)
}

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
    InitializeDatabase,
    Query
}
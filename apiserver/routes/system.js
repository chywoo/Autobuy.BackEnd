"use strict"

const express = require('express');
const router = express.Router();
const db = require('../services/database');

const resultOK = {
    result: "OK",
    message: ""
}


function IsSuspend() {
    let checkSql = `SELECT suspendSystem FROM APIControlStatus`;
    db.pool.query(checkSql, (err, data) => {
        if (err) {
            console.error(err.message);
            return "Error";
        } else {
            if (data[0].length === 0) {
                return "Error";
            } else if (data[0].length > 0) {
                let suspendSystem = data[0].suspendSystem;
                if (suspendSystem === true) {
                    return "True";
                } else {
                    return "False";
                }
            }
        }
    });
}


/**
 * Get current user status
 */
router.get('/', (req, res) => {

    if ( req.session.islogin === undefined
        || req.session.islogin === false
        || req.session.roleID != 3 ) {
        res.status(403).json({
            result: "Error",
            message: "You are not authorized."
        });
        return;
    }

    // return system status. System status is stored in app.locals
    res.status(200).json({
        suspendSystem: req.app.locals.suspendSystem,
        suspendAccessToken: req.app.locals.suspendAccessToken
    });
});


/**
 * Suspends the system.
 */
router.get('/suspendsystem', (req, res) => {
    req.app.locals.suspendSystem = true;

    res.status(200).json({
        result: "OK",
        message: "System is suspended."
    });
});


/**
 * Suspends the access key system.
 */
router.get('/suspendkey', (req, res) => {
    req.app.locals.suspendAccessToken = true;

    res.status(200).json({
        result: "OK",
        message: "Key System is suspended."
    });
});


/**
 * Recover system to normal
 */
router.get('/recover', (req, res) => {
    req.app.locals.suspendAccessToken = false;
    req.app.locals.suspendSystem = false;

    res.status(200).json({
        result: "OK",
        message: "System is recovered."
    });
});
module.exports = router;

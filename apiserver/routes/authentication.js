"use strict";

const express = require('express');
const router = express.Router();
const db = require('../services/database');
const {
    sendBadRequest,
    sendNotFound,
    sendServerError,
    handleDbError,
} = require('../utils/http');

function getAccessKey(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return null;
    }

    if (!authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.slice(7).trim();
}

router.get('/', (req, res) => {
    if (req.session.islogin) {
        return res.json({
            result: 'OK',
            message: 'Already logged in',
        });
    }

    return sendError(res, 401, 'Not logged in');
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return sendServerError(res);
        }

        return res.json({
            result: 'OK',
            message: 'Logout success',
        });
    });
});

router.post('/login', async (req, res) => {
    if (req.session.islogin) {
        return res.json({
            result: 'OK',
            message: 'Already logged in',
        });
    }

    const accessKey = getAccessKey(req);

    let sql = '';
    let params = [];

    if (accessKey) {
        sql = `
            SELECT B.userName, B.roleID
            FROM AccessKeys A
                JOIN UserInfo B ON A.userName = B.userName
            WHERE A.accessKey = ?
            LIMIT 1`;
        params = [accessKey];
    } else {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return sendBadRequest(res, 'Wrong parameters');
        }

        sql = `
            SELECT userName, roleID
            FROM UserInfo
            WHERE userName = ? AND password = SHA2(?, 256)
            LIMIT 1`;
        params = [userName, password];
    }

    try {
        const rows = await db.query(sql, params);

        if (!rows || rows.length === 0) {
            return sendNotFound(res, 'Wrong user name or password');
        }

        req.session.islogin = true;
        req.session.userName = rows[0].userName;
        req.session.roleID = rows[0].roleID;

        return res.json({
            result: 'OK',
            message: '',
        });
    } catch (err) {
        return handleDbError(res, err);
    }
});

function sendError(res, status, message) {
    return res.status(status).json({
        result: 'Error',
        message,
    });
}

module.exports = router;

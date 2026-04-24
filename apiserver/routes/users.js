"use strict";

const express = require('express');
const router = express.Router();
const db = require('../services/database');
const {
    sendForbidden,
    sendBadRequest,
    sendNotFound,
    handleDbError,
    parsePagination,
} = require('../utils/http');

function isAdmin(req) {
    return Number(req.session.roleID) === 3;
}

function mapUser(row) {
    return {
        userName: row.userName,
        password: '',
        fullName: row.fullName,
        email: row.email,
        roleID: row.roleID,
        role: {
            roleID: row.roleID,
            roleName: row.roleName,
        },
    };
}

router.post('/', async (req, res) => {
    const { userName, password, fullName, email, roleID } = req.body;

    if (!userName || !password || !fullName || !email || roleID === undefined) {
        return sendBadRequest(res, 'User information is invalid.');
    }

    const sql = `
        INSERT INTO UserInfo (userName, Password, fullName, email, roleID)
        VALUES (?, SHA2(?, 256), ?, ?, ?)`;

    try {
        await db.query(sql, [userName, password, fullName, email, roleID]);

        return res.status(201).json({
            result: 'OK',
            message: '',
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(200).json({
                result: 'DUPLICATED',
                message: 'The user already exists.',
            });
        }

        return handleDbError(res, err);
    }
});

router.get('/', async (req, res) => {
    if (!isAdmin(req)) {
        return sendForbidden(res);
    }

    const { page, pageSize, offset } = parsePagination(req.query);

    const countSql = 'SELECT COUNT(*) AS total FROM UserInfo';
    const listSql = `
        SELECT A.userName, A.fullName, A.email, A.roleID, B.roleName
        FROM UserInfo A
            LEFT JOIN Roles B ON A.roleID = B.roleID
        ORDER BY A.userName
        LIMIT ?, ?`;

    try {
        const [countRows, users] = await Promise.all([
            db.query(countSql),
            db.query(listSql, [offset, pageSize]),
        ]);

        if (users.length === 0) {
            return sendNotFound(res, 'User not found.');
        }

        return res.status(200).json({
            total: countRows[0].total,
            pageSize,
            page,
            users: users.map(mapUser),
        });
    } catch (err) {
        return handleDbError(res, err);
    }
});

router.get('/:userName', async (req, res) => {
    const targetUserName = req.params.userName;

    if (!isAdmin(req) && req.session.userName !== targetUserName) {
        return sendForbidden(res);
    }

    const sql = `
        SELECT A.userName, A.fullName, A.email, A.roleID, B.roleName
        FROM UserInfo A
            LEFT JOIN Roles B ON A.roleID = B.roleID
        WHERE A.userName = ?
        LIMIT 1`;

    try {
        const rows = await db.query(sql, [targetUserName]);

        if (rows.length === 0) {
            return sendNotFound(res, 'User not found.');
        }

        return res.status(200).json(mapUser(rows[0]));
    } catch (err) {
        return handleDbError(res, err);
    }
});

router.put('/:userName', async (req, res) => {
    if (!isAdmin(req)) {
        return sendForbidden(res);
    }

    const targetUserName = req.params.userName;
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        return sendBadRequest(res, 'fullName and email are required.');
    }

    const sql = `
        UPDATE UserInfo
        SET fullName = ?, email = ?
        WHERE userName = ?`;

    try {
        const result = await db.query(sql, [fullName, email, targetUserName]);

        if (result.affectedRows === 0) {
            return sendNotFound(res, 'User not found.');
        }

        return res.status(200).json({
            result: 'OK',
            message: '',
        });
    } catch (err) {
        return handleDbError(res, err);
    }
});

router.delete('/:userName', async (req, res) => {
    if (!isAdmin(req)) {
        return sendForbidden(res);
    }

    const sql = 'DELETE FROM UserInfo WHERE userName = ?';

    try {
        const result = await db.query(sql, [req.params.userName]);

        if (result.affectedRows === 0) {
            return sendNotFound(res, 'User not found.');
        }

        return res.status(200).json({
            result: 'OK',
            message: '',
        });
    } catch (err) {
        return handleDbError(res, err);
    }
});

module.exports = router;

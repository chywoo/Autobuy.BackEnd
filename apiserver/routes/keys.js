"use strict"

const express = require('express');
const router = express.Router();
const db = require('../services/database');
const {v4: uuidv4} = require('uuid');

const resultOK = {
    result: "OK",
    message: ""
}

/**
 * Key generator. Key size is 32 characters.
 */
function generateKey() {
    return uuidv4().replaceAll("-", "");
}

/**
 * Create a access key for a user.
 */
router.post('/', (req, res) => {
    // No parameters
    let userName = req.query.userName;

    // Invalid data
    if (userName === undefined || userName === "") {
        res.status(400).json({
            result: "Error",
            message: "User name is invalid."
        });

        return;
    } else {
        let checkSql =
            `SELECT * FROM UserInfo WHERE userName = '${userName}'; 
             SELECT * FROM AccessKeys WHERE userName = '${userName}';`;
        db.pool.query(checkSql, (err, data) => {
            if (err) {
                console.error(err.message);
                switch (err.code) {
                    default:
                        let result = "Error";
                        let message = err.sqlMessage
                        res.status(500).json({
                            result: result,
                            message: message
                        });
                        break;
                }
            } else {
                if (data[0].length === 0) {
                    res.status(400).json({
                        result: "NotOK",
                        message: "Invalid user name."
                    });
                    return;
                } else if (data[1].length > 0) {
                    res.status(400).json({
                        result: "NotOK",
                        message: "The user already has an access key."
                    });
                    return;
                }

                let key = generateKey();
                let sql = `INSERT INTO AccessKeys (accessKey, userName) VALUES ( '${key}', '${userName}' )`

                db.pool.query(sql, (err, data) => {
                    let result = "OK";
                    let message = "";

                    if (err) {
                        console.error(err.message);

                        switch (err.code) {
                            case "ER_DUP_ENTRY":
                                result = "DUPLICATED";
                                message = "The access key already exists.";
                                res.status(200).json({
                                    result: result,
                                    message: message
                                });
                                break;

                            default:
                                res.status(500).json({
                                    result: "Error",
                                    message: err.sqlMessage
                                });
                                break;
                        }
                    } else {
                        res.status(201).json({
                            accessKey: key,
                            userName: userName
                        });
                    }
                });
            }
        })
    }
});


/**
 * Delete access key by user name
 */
router.delete('/', (req, res) => {
    // No parameters
    let userName = req.query.userName;

    // Invalid data
    if (userName === undefined || userName === "") {
        res.status(400).json({
            result: "Error",
            message: "User name is invalid."
        });

        return;
    } else {
        let sql =
            `DELETE FROM AccessKeys WHERE userName = '${userName}'`;

        db.pool.query(sql, (err, data) => {
            if (err) {
                console.error(err.message);

                switch (err.code) {
                    default:
                        let result = "Error";
                        let message = err.sqlMessage
                        res.status(500).json({
                            result: result,
                            message: message
                        });
                        break;
                }
            } else {
                if (data.affectedRows === 0) {
                    res.status(404).json({
                        result: "NotOK",
                        message: "User name not found."
                    });
                } else {
                    res.status(200).json(resultOK);
                }
            }
        });
    }
});

/**
 * Get the user information by an access key.
 */
router.get('/:id', (req, res) => {
    let id = req.params.id;

    let sql =
        `SELECT B.*, C.roleName 
        FROM AccessKeys A 
             JOIN UserInfo B ON A.userName = B.userName 
             JOIN Roles C ON B.roleID = C.roleID
        WHERE A.accessKey = '${id}'`;

    db.pool.query(sql, (err, data) => {
        let result = "OK";
        let message = "";

        if (err) {
            console.error(err.message);

            switch (err.code) {
                default:
                    result = "Error";
                    message = err.sqlMessage
                    res.status(500).json({
                        result: result,
                        message: message
                    });
                    break;
            }
        } else {
            if (data.length === 0) {
                res.status(404).json({
                    result: "NotOK",
                    message: "Access key not found."
                });
                return;
            }

            try {
                let userInfo = {
                    userName: data[0].userName,
                    password: "",
                    fullName: data[0].fullName,
                    email: data[0].email,
                    roleID: data[0].roleID,
                    role: {
                        roleID: data[0].roleID,
                        roleName: data[0].roleName
                    }
                }
                res.status(200).json(userInfo);
            } catch (err) {
                console.error(err.message)
                result = "Error";
                message = err.sqlMessage
                res.status(500).json({
                    result: result,
                    message: message
                });
            }
        }
    });
});

module.exports = router;

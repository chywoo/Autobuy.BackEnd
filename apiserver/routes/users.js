"use strict"

const express = require('express');
const router = express.Router();
const db = require('../services/database');


const resultOK = {
  result: "OK",
  message: ""
}



/**
 * Create user
 */
router.post('/', (req, res) => {

    // No parameters
    if (Object.keys(req.body).length === 0) {
        result.result = "NotOK";
        result.message = "No parameters";

        res.status(204).json(res);
    } else {
        console.info(req.body)

        let userName = req.body.userName;
        let password = req.body.password;
        let fullName = req.body.fullName;
        let email = req.body.email;

        // Invalid data
        if ( userName === undefined
            || password === undefined
            || fullName === undefined
            || email === undefined ) {

            res.status(400).json({
                result: "Error",
                message: "ID or password are invalid."
            });

            return;
        }

        let sql = `INSERT INTO UserInfo (userName, Password, fullName, email) 
                VALUES ( '${userName}', '${password}', '${fullName}', '${email}' )`


        db.pool.query(sql, (err, data) => {
            let result = "OK";
            let message = "";

            if (err) {
                console.error(err.message);

                switch (err.code) {
                    case "ER_DUP_ENTRY":
                        result = "DUPLICATED";
                        message = "The user already exists.";
                        res.status(200).json({
                            result: result,
                            message: message
                        });
                        break;

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
                res.status(201).json({
                    result: result,
                    message: message
                });
            }
        });
    }
});

/**
 * Get the list of users
 */
router.get('/', (req, res) => {
    let sql =
        `SELECT A.*, B.roleName 
        FROM UserInfo A LEFT OUTER JOIN Roles B ON (A.roleID = B.roleID) 
        ORDER BY userName`;

    // Check if the user is admin
    if (req.session.roleID != 3) {
        res.status(403).json({
            result: "Error",
            message: "You are not authorized to access this page."
        });
        return;
    }

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
            if (data.length === 0) {
                res.status(404).json({
                    result: "NotOK",
                    message: "User not found."
                });
                return;
            }

            try {
                let users = [];

                for (let i = 0; i < data.length; i++) {
                    let user = {
                        userName: data[i].userName,
                        password: "",
                        fullName: data[i].fullName,
                        email: data[i].email,
                        roleID: data[i].roleID,
                        role: {
                            roleID: data[i].roleID,
                            roleName: data[i].roleName
                        }
                    }
                    users.push(user);
                }
                res.status(200).json(users);
            }
            catch (err) {
                console.error(err.message)
                let result = "Error";
                let message = err.sqlMessage
                res.status(500).json({
                    result: result,
                    message: message
                });
            }
        }
    });
});

/**
 * Get the details of specific user.
 */
router.get('/:userName', (req, res) => {
    let userName = req.params.userName;

    let sql =
        `SELECT A.*, B.roleName 
        FROM UserInfo A LEFT OUTER JOIN Roles B ON (A.roleID = B.roleID) 
        WHERE userName = '${userName}'
        ORDER BY userName`;

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
                    message: "User not found."
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
            }
            catch (err) {
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

/**
 * Update the specific user.
 */
router.put('/:userName', (req, res) => {
    let userName = req.params.userName;
    let userInfo = req.body;
    let sql = "";

    try {
        sql =
        `UPDATE UserInfo
        SET 
            fullName = '${userInfo.fullName}',
            email = '${userInfo.email}'
        WHERE userName = '${userName}'`;
    }
    catch (err) {
        console.error(err.message)
        let result = "Error";
        let message = err.message

        // 400 Bad Request: Invalid data
        res.status(400).json({
            result: result,
            message: message
        });

        return;
    }

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
            if (data.affectedRows === 0) {
                res.status(404).json({
                    result: "NotOK",
                    message: "User not found."
                });
            } else {
                res.status(200).json(resultOK);
            }
        }
    });
});


/**
 * Delete the specific user.
 */
router.delete('/:userName', (req, res) => {
    let userName = req.params.userName;
    let sql = "";

    try {
        sql = `DELETE FROM UserInfo WHERE userName = '${userName}'`;
    }
    catch (err) {
        console.error(err.message)
        let result = "Error";
        let message = err.message

        // 400 Bad Request: Invalid data
        res.status(400).json({
            result: result,
            message: message
        });

        return;
    }

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
                    message: "User not found."
                });
            } else {
                res.status(200).json(resultOK);
            }
        }
    });
});


module.exports = router;

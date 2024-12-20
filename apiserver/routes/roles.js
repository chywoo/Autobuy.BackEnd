"use strict"

const express = require('express');
const router = express.Router();
const db = require('../services/database');

const resultOK = {
    result: "OK",
    message: ""
}

/**
 * Create a role
 */
router.post('/', (req, res) => {
    // Check if the user is admin
    if (req.session.roleID != 3) {
        res.status(403).json({
            result: "Error",
            message: "You are not authorized."
        });
        return;
    }

    // No parameters
    if (Object.keys(req.body).length === 0) {
        result.result = "NotOK";
        result.message = "No parameters";

        res.status(204).json(res);
    } else {
        console.info(req.body)

        let roleName = req.body.roleName;

        // Invalid data
        if ( roleName === undefined || roleName === "" ) {

            res.status(400).json({
                result: "Error",
                message: "Role name is invalid."
            });

            return;
        }

        let sql = `INSERT INTO Roles (roleName) VALUES ( '${roleName}' )`

        db.pool.query(sql, (err, data) => {
            let result = "OK";
            let message = "";

            if (err) {
                console.error(err.message);

                switch (err.code) {
                    case "ER_DUP_ENTRY":
                        result = "DUPLICATED";
                        message = "The role already exists.";
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
 * Get the list of roles
 */
router.get('/', (req, res) => {
    // Check if the user is admin
    if (req.session.roleID != 3) {
        res.status(403).json({
            result: "Error",
            message: "You are not authorized."
        });
        return;
    }

    let sql = `SELECT * FROM Roles ORDER BY roleName`;

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
                        roleID: data[i].roleID,
                        roleName: data[i].roleName
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
 * Get the details of specific role.
 */
router.get('/:id', (req, res) => {
    // Check if the user is admin
    if (req.session.roleID != 3) {
        res.status(403).json({
            result: "Error",
            message: "You are not authorized."
        });
        return;
    }

    let id = parseInt(req.params.id);

    // Check if ID is a number.
    if ( typeof id != 'number' ) {
        res.status(400).json({
            result: "Error",
            message: "ID must be a number."
        });
        return;
    }

    let sql = `SELECT * FROM Roles WHERE roleID = '${id}'`;

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
                    message: "Role not found."
                });
                return;
            }

            try {
                let roleInfo = {
                    roleID: data[0].roleID,
                    roleName: data[0].roleName
                }
                res.status(200).json(roleInfo);
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
 * Delete a role.
 */
router.delete('/:id', (req, res) => {
    // Check if the user is admin
    if (req.session.roleID != 3) {
        res.status(403).json({
            result: "Error",
            message: "You are not authorized."
        });
        return;
    }

    let id = parseInt(req.params.id);

    // Check if ID is a number.
    if ( typeof id != 'number' ) {
        res.status(400).json({
            result: "Error",
            message: "ID must be a number."
        });
        return;
    }

    let sql = "";

    try {
        sql = `DELETE FROM Roles WHERE roleID = '${id}'`
    } catch (err) {
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
                    message: "Role not found."
                });
            } else {
                res.status(200).json(resultOK);
            }
        }
    });
});

/**
 * Get the list of users of a specific role.
 */
router.get('/:id/users', (req, res) => {
    // Check if the user is admin
    if (req.session.roleID != 3) {
        res.status(403).json({
            result: "Error",
            message: "You are not authorized."
        });
        return;
    }

    let id = parseInt(req.params.id);

    // Check if ID is a number.
    if ( typeof id != 'number' ) {
        res.status(400).json({
            result: "Error",
            message: "ID must be a number."
        });
        return;
    }

    if (id === undefined || id === "" || !Number.isInteger(+id)) {
        res.status(400).json({
            result: "Error",
            message: "Role ID is invalid."
        });
        return;
    }

    let sql =
        `SELECT A.* 
        FROM UserInfo A JOIN Roles B ON A.roleID = B.roleID 
        WHERE B.roleID = ${id}
        ORDER BY roleName;`

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

module.exports = router;

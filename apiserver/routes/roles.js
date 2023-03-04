"use strict"

const express = require('express');
const router = express.Router();
const db = require('../services/database');

const resultOK = {
    result: "OK",
    message: ""
}

/**
 * Get the list of roles
 */
router.get('/', (req, res) => {
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
                        roleId: data[i].roleID,
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
    let id = req.params.id;

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

module.exports = router;

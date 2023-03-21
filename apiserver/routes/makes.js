"use strict"

const express = require('express');
const router = express.Router();
const db = require('../services/database');

const resultOK = {
    result: "OK",
    message: ""
}

/**
 * Get the list of makes. This returns the list of makes that have at least one car.
 */
router.get('/', (req, res) => {
    let sql =
       `SELECT *  FROM MakeInfo A
        WHERE EXISTS ( SELECT * FROM CarInfo B WHERE A.makeID = B.makeID)
        ORDER BY makerName`;

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
                    let MakeInfo = {
                        makeID: data[i].makeID,
                        makerName: data[i].makerName
                    }
                    users.push(MakeInfo);
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
 * Get the details of specific maker    .
 */
router.get('/:id', (req, res) => {
    let id = req.params.id;

    let sql = `SELECT * FROM MakeInfo WHERE makeID = '${id}'`;

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
                    message: "Maker not found."
                });
                return;
            }

            try {
                let MakeInfo = {
                    makeID: data[0].makeID,
                    makerName: data[0].makerName
                }
                res.status(200).json(MakeInfo);
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
